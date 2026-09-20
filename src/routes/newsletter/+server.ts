import { json, redirect } from '@sveltejs/kit';
import { EMAILOCTOPUS_API_KEY, EMAILOCTOPUS_LIST_ID } from '$env/static/private';
import { subscribe, type SubscribeOutcome } from '$lib/newsletter';
import type { RequestHandler } from './$types';

/**
 * Newsletter signup.
 *
 * This route exists so the mailing-list credential stays on the server.
 *
 * The decision-making lives in `$lib/newsletter`; this only maps an outcome
 * onto HTTP.
 */
export const prerender = false;

function wantsJson(request: Request): boolean {
	return (request.headers.get('accept') ?? '').includes('application/json');
}

/**
 * What the visitor is told.
 *
 * "Already subscribed" is reported as success on purpose: telling a stranger
 * whether a given address is on the list is an account-enumeration leak, and
 * for a real subscriber re-submitting, success is also the honest answer.
 * A bot that tripped the honeypot gets success too, so it does not retry.
 */
function present(outcome: SubscribeOutcome): { ok: boolean; status: number } {
	switch (outcome.status) {
		case 'subscribed':
		case 'already-subscribed':
		case 'bot':
			return { ok: true, status: 200 };
		case 'invalid':
			return { ok: false, status: 422 };
		case 'unavailable':
			return { ok: false, status: 502 };
	}
}

export const POST: RequestHandler = async ({ request, fetch }) => {
	const form = await request.formData();

	const outcome = await subscribe(
		{ email: form.get('email'), honeypot: form.get('website') },
		{ apiKey: EMAILOCTOPUS_API_KEY, listId: EMAILOCTOPUS_LIST_ID, fetch }
	);

	// Upstream problems are invisible to the visitor by design, so leave a trace
	// in the function logs — otherwise a broken key looks identical to success.
	if (outcome.status === 'unavailable') {
		console.error(`[newsletter] signup unavailable: ${outcome.reason}`);
	}

	const { ok, status } = present(outcome);

	if (wantsJson(request)) {
		return json({ ok }, { status });
	}

	// No-JS path: the signup block sits on prerendered pages, which cannot read a
	// query string, so confirmation lives on its own route instead. Every
	// outcome lands there — a raw error page would be a poor ending to a form.
	redirect(303, `/newsletter/thanks${ok ? '' : '?status=error'}`);
};
