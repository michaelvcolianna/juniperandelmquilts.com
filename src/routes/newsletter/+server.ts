import { json, redirect, error } from '@sveltejs/kit';
import { EMAILOCTOPUS_API_KEY, EMAILOCTOPUS_LIST_ID } from '$env/static/private';
import type { RequestHandler } from './$types';

/**
 * Newsletter signup.
 *
 * This route exists so the mailing-list credential stays on the server. The Nuxt
 * build called Brevo directly from the browser with the key in
 * `runtimeConfig.public`, so it shipped in the client bundle (commits 86ebc62,
 * ae739df, 81c1d96 show this was a workaround for a 401, not a decision).
 *
 * Double opt-in is governed by the list's own setting in EmailOctopus, not by
 * this code: omitting `status` makes a new contact `pending` on a double-opt-in
 * list, which triggers the confirmation email. Enable it at
 * Lists -> (list) -> Settings -> Double opt-in before going live.
 */
export const prerender = false;

const API = 'https://api.emailoctopus.com';

function wantsJson(request: Request): boolean {
	return (request.headers.get('accept') ?? '').includes('application/json');
}

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const email = String(form.get('email') ?? '').trim();
	const honeypot = String(form.get('website') ?? '').trim();

	const respond = (ok: boolean, status = ok ? 200 : 400) => {
		if (wantsJson(request)) {
			return json({ ok }, { status });
		}
		// No-JS path: the signup block sits on prerendered pages, which can't read
		// a query string, so confirmation lives on its own route instead.
		throw redirect(303, `/newsletter/thanks${ok ? '' : '?status=error'}`);
	};

	// A filled honeypot means a bot. Report success so it doesn't retry.
	if (honeypot) return respond(true);

	if (!email || !email.includes('@')) return respond(false, 422);

	let response: Response;

	try {
		response = await fetch(`${API}/lists/${EMAILOCTOPUS_LIST_ID}/contacts`, {
			method: 'POST',
			headers: {
				authorization: `Bearer ${EMAILOCTOPUS_API_KEY}`,
				'content-type': 'application/json'
			},
			// `status` is deliberately omitted — see the note above.
			body: JSON.stringify({ email_address: email })
		});
	} catch {
		throw error(502, 'The newsletter service could not be reached.');
	}

	// 409 means the address is already on the list. Report success rather than
	// confirming to a stranger whether a given address is subscribed.
	if (response.ok || response.status === 409) {
		return respond(true);
	}

	return respond(false, 502);
};
