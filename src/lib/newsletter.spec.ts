import { describe, it, expect, vi } from 'vitest';
import { subscribe, normalizeEmail, isValidEmail, API_ORIGIN } from './newsletter';

const config = (fetchImpl: typeof globalThis.fetch) => ({
	apiKey: 'test-key',
	listId: 'test-list',
	fetch: fetchImpl
});

const responding = (status: number, body: unknown = {}) =>
	vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

describe('normalizeEmail', () => {
	it('trims and lowercases', () => {
		expect(normalizeEmail('  Lani@Example.COM  ')).toBe('lani@example.com');
	});

	it('coerces absent values to an empty string', () => {
		expect(normalizeEmail(undefined)).toBe('');
		expect(normalizeEmail(null)).toBe('');
	});
});

describe('isValidEmail', () => {
	it.each(['a@b.co', 'lani@juniperandelmquilts.com', 'first.last+tag@sub.example.org'])(
		'accepts %s',
		(email) => expect(isValidEmail(email)).toBe(true)
	);

	// The previous check was `email.includes('@')`, which accepted every one of
	// these.
	it.each(['@', 'a@', '@b', 'nope', 'a@b', 'two @spaces.com', ''])('rejects %j', (email) =>
		expect(isValidEmail(email)).toBe(false)
	);

	it('rejects absurdly long addresses', () => {
		expect(isValidEmail(`${'a'.repeat(250)}@example.com`)).toBe(false);
	});
});

describe('subscribe', () => {
	it('reports success when EmailOctopus accepts the contact', async () => {
		const fetchImpl = responding(201);
		await expect(subscribe({ email: 'lani@example.com' }, config(fetchImpl))).resolves.toEqual({
			status: 'subscribed'
		});
	});

	it('posts to the list endpoint with a bearer token and no status field', async () => {
		const fetchImpl = responding(201);
		await subscribe({ email: 'Lani@Example.com' }, config(fetchImpl));

		const [url, init] = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
		expect(url).toBe(`${API_ORIGIN}/lists/test-list/contacts`);
		expect(init.method).toBe('POST');
		expect(init.headers.authorization).toBe('Bearer test-key');

		const body = JSON.parse(init.body);
		// Omitting `status` is what makes a double-opt-in list send confirmation.
		expect(body).toEqual({ email_address: 'lani@example.com' });
		expect(body).not.toHaveProperty('status');
	});

	it('distinguishes an existing contact (409) from a new one', async () => {
		await expect(
			subscribe({ email: 'lani@example.com' }, config(responding(409)))
		).resolves.toEqual({ status: 'already-subscribed' });
	});

	it('never calls the API when the honeypot is filled', async () => {
		const fetchImpl = responding(201);
		const outcome = await subscribe(
			{ email: 'lani@example.com', honeypot: 'http://spam.example' },
			config(fetchImpl)
		);

		expect(outcome).toEqual({ status: 'bot' });
		expect(fetchImpl).not.toHaveBeenCalled();
	});

	it('rejects an invalid address without calling the API', async () => {
		const fetchImpl = responding(201);
		const outcome = await subscribe({ email: 'nope' }, config(fetchImpl));

		expect(outcome.status).toBe('invalid');
		expect(fetchImpl).not.toHaveBeenCalled();
	});

	it('treats an upstream rejection as invalid, not as an outage', async () => {
		const outcome = await subscribe({ email: 'a@b.co' }, config(responding(422)));
		expect(outcome.status).toBe('invalid');
	});

	it('reports unavailable on a server error, carrying the status for the log', async () => {
		const outcome = await subscribe({ email: 'a@b.co' }, config(responding(500)));
		expect(outcome).toEqual({ status: 'unavailable', reason: 'upstream 500' });
	});

	it('reports unavailable when the network fails', async () => {
		const fetchImpl = vi.fn(async () => {
			throw new TypeError('fetch failed');
		}) as unknown as typeof fetch;

		await expect(subscribe({ email: 'a@b.co' }, config(fetchImpl))).resolves.toEqual({
			status: 'unavailable',
			reason: 'network'
		});
	});

	it('gives up rather than hanging when upstream stalls', async () => {
		const fetchImpl = vi.fn(
			(_url: string, init: RequestInit) =>
				new Promise((_resolve, reject) => {
					init.signal?.addEventListener('abort', () => {
						const err = new Error('timed out');
						err.name = 'TimeoutError';
						reject(err);
					});
				})
		) as unknown as typeof fetch;

		const outcome = await subscribe(
			{ email: 'a@b.co' },
			{ apiKey: 'k', listId: 'l', fetch: fetchImpl, timeoutMs: 10 }
		);

		expect(outcome).toEqual({ status: 'unavailable', reason: 'timeout' });
	});

	it('fails loudly rather than silently when credentials are missing', async () => {
		const fetchImpl = responding(201);
		const outcome = await subscribe(
			{ email: 'a@b.co' },
			{ apiKey: '', listId: '', fetch: fetchImpl }
		);

		expect(outcome.status).toBe('unavailable');
		expect(fetchImpl).not.toHaveBeenCalled();
	});
});
