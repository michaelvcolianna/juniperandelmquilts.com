/**
 * Newsletter subscription against the EmailOctopus v2 API.
 *
 * Kept separate from the route so the decision-making is testable without an
 * HTTP layer. The route handles status codes and redirects; this decides what
 * actually happened.
 *
 * Double opt-in is governed by the list's own setting in EmailOctopus, not by
 * this code: omitting `status` makes a new contact `pending` on a double-opt-in
 * list, which is what triggers the confirmation email. Enable it at
 * Lists -> (list) -> Settings -> Double opt-in before going live, or signups
 * will be single opt-in and the confirmation mail will never be sent.
 */

export const API_ORIGIN = 'https://api.emailoctopus.com';

/** How long to wait on EmailOctopus before giving up. */
export const REQUEST_TIMEOUT_MS = 8000;

/**
 * Deliberately permissive — the goal is to reject obvious junk cheaply and give
 * a useful message, not to re-implement RFC 5322. EmailOctopus does the
 * authoritative validation, and double opt-in is the real proof of ownership.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value: unknown): string {
	return String(value ?? '')
		.trim()
		.toLowerCase();
}

export function isValidEmail(value: string): boolean {
	return value.length <= 254 && EMAIL_PATTERN.test(value);
}

export type SubscribeOutcome =
	| { status: 'subscribed' }
	/** Already on the list. Truthful here; the route decides what to reveal. */
	| { status: 'already-subscribed' }
	| { status: 'invalid'; reason: string }
	/** The honeypot was filled, so no request was made. */
	| { status: 'bot' }
	| { status: 'unavailable'; reason: string };

export interface SubscribeInput {
	email: unknown;
	honeypot?: unknown;
}

export interface SubscribeConfig {
	apiKey: string;
	listId: string;
	/** Injectable for tests. */
	fetch?: typeof globalThis.fetch;
	timeoutMs?: number;
}

export async function subscribe(
	input: SubscribeInput,
	config: SubscribeConfig
): Promise<SubscribeOutcome> {
	// A filled honeypot means a bot. Never call the API for one.
	if (normalizeEmail(input.honeypot).length > 0) {
		return { status: 'bot' };
	}

	const email = normalizeEmail(input.email);

	if (!email) return { status: 'invalid', reason: 'No email address was given.' };
	if (!isValidEmail(email)) {
		return { status: 'invalid', reason: 'That does not look like an email address.' };
	}

	if (!config.apiKey || !config.listId) {
		return { status: 'unavailable', reason: 'Newsletter credentials are not configured.' };
	}

	const doFetch = config.fetch ?? globalThis.fetch;

	let response: Response;

	try {
		response = await doFetch(`${API_ORIGIN}/lists/${config.listId}/contacts`, {
			method: 'POST',
			headers: {
				authorization: `Bearer ${config.apiKey}`,
				'content-type': 'application/json'
			},
			// `status` is deliberately omitted — see the note at the top.
			body: JSON.stringify({ email_address: email }),
			// Without this a hung upstream holds the function open until the
			// platform kills it, which surfaces to the visitor as a blank failure.
			signal: AbortSignal.timeout(config.timeoutMs ?? REQUEST_TIMEOUT_MS)
		});
	} catch (cause) {
		const reason = cause instanceof Error && cause.name === 'TimeoutError' ? 'timeout' : 'network';
		return { status: 'unavailable', reason };
	}

	if (response.ok) return { status: 'subscribed' };

	// 409 "already-exists" — the address is on the list already.
	if (response.status === 409) return { status: 'already-subscribed' };

	// 422 means EmailOctopus rejected the address itself.
	if (response.status === 422 || response.status === 400) {
		return { status: 'invalid', reason: 'That address was rejected by the mailing list.' };
	}

	return { status: 'unavailable', reason: `upstream ${response.status}` };
}
