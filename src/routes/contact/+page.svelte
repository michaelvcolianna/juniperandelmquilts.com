<script lang="ts">
	import { tick } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SocialMedia from '$lib/components/SocialMedia.svelte';
	import { CONTACT_EMAIL } from '$lib/site';

	const FORM_NAME = 'contact';

	type Status = 'idle' | 'submitting' | 'success' | 'error';

	let status = $state<Status>('idle');
	let resultEl = $state<HTMLElement | null>(null);

	/**
	 * Netlify discovers forms by parsing static HTML at deploy time, and its form
	 * handler must receive the POST before the SSR function does. Posting to the
	 * `static/__forms.html` skeleton is Netlify's documented approach for SSR
	 * frameworks, and it doubles as the no-JS fallback — without JS the browser
	 * submits there directly and lands on Netlify's own confirmation page.
	 */
	const ACTION = '/__forms.html';

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		const form = event.currentTarget as HTMLFormElement;
		status = 'submitting';

		try {
			const response = await fetch(ACTION, {
				method: 'POST',
				headers: { 'content-type': 'application/x-www-form-urlencoded' },
				// Netlify Forms expects url-encoded bodies, not JSON or multipart.
				body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>)
			});

			status = response.ok ? 'success' : 'error';
			if (response.ok) form.reset();
		} catch {
			status = 'error';
		}

		await tick();
		resultEl?.focus();
	}
</script>

<Seo
	title="Contact"
	description="Ways to get in touch with Juniper & Elm Quilts, including a message form."
/>

<section class="block container contact">
	<div class="contact__intro">
		<h1>Contact us.</h1>

		<p><a href="mailto:{CONTACT_EMAIL}" class="contact__email">{CONTACT_EMAIL}</a></p>

		<SocialMedia />
	</div>

	<form
		name={FORM_NAME}
		method="POST"
		action={ACTION}
		data-netlify="true"
		{...{ 'netlify-honeypot': 'bot-field' }}
		onsubmit={handleSubmit}
	>
		<input type="hidden" name="form-name" value={FORM_NAME} />

		<!-- Honeypot: hidden from people, tempting to bots. -->
		<p class="contact__hp" aria-hidden="true">
			<label for="bot-field">Leave this field empty</label>
			<input id="bot-field" name="bot-field" type="text" tabindex="-1" autocomplete="off" />
		</p>

		<fieldset>
			<legend>Name <span aria-hidden="true">*</span></legend>

			<div class="contact__field">
				<label for="first-name">First name</label>
				<input
					id="first-name"
					name="firstName"
					type="text"
					required
					autocomplete="given-name"
					autocorrect="off"
					spellcheck="false"
				/>
			</div>

			<div class="contact__field">
				<label for="last-name">Last name</label>
				<input
					id="last-name"
					name="lastName"
					type="text"
					required
					autocomplete="family-name"
					autocorrect="off"
					spellcheck="false"
				/>
			</div>
		</fieldset>

		<div class="contact__field">
			<label for="email">Email <span aria-hidden="true">*</span></label>
			<input
				id="email"
				name="email"
				type="email"
				required
				autocomplete="email"
				autocapitalize="off"
				autocorrect="off"
				spellcheck="false"
			/>
		</div>

		<div class="contact__field">
			<label for="message">Message <span aria-hidden="true">*</span></label>
			<textarea id="message" name="message" rows="8" required></textarea>
		</div>

		<p class="contact__required">
			Fields marked <span aria-hidden="true">*</span><span class="sr-only">with an asterisk</span> are
			required.
		</p>

		<button type="submit" disabled={status === 'submitting'}>
			{status === 'submitting' ? 'Sending…' : 'Send'}
		</button>
	</form>

	{#if status === 'success' || status === 'error'}
		<p bind:this={resultEl} tabindex="-1" role="status" class="contact__result">
			{#if status === 'success'}
				Thank you for your message. If it was an inquiry, we'll get back to you within 1&ndash;3
				business days.
			{:else}
				There was a problem sending your message. Please try again, or email us directly at
				<a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>.
			{/if}
		</p>
	{/if}
</section>

<style>
	.contact {
		display: grid;
		gap: clamp(2rem, 6vw, 3.5rem);
		align-items: start;
	}

	.contact__intro {
		display: grid;
		gap: var(--stack);
		justify-items: start;
	}

	form {
		display: grid;
		gap: 1.25rem;
	}

	fieldset {
		display: grid;
		gap: 1rem;
	}

	/*
	 * A standalone link, so WCAG 2.2 2.5.8's inline exception does not apply and
	 * it needs a real target height. (The "MVC" credit in the footer sits inside
	 * a sentence and is exempt.)
	 */
	.contact__email {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-target);
	}

	.contact__required {
		font-size: var(--text-sm);
		color: var(--muted);
	}

	.contact button {
		justify-self: start;
	}

	.contact__result {
		grid-column: 1 / -1;
		padding: 1rem 1.25rem;
		border-left: 3px solid var(--accent);
		background-color: var(--paper-sunk);
	}

	.contact__hp {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@media (min-width: 48em) {
		.contact {
			grid-template-columns: 4fr 7fr;
			column-gap: var(--gutter);
		}

		fieldset {
			grid-template-columns: 1fr 1fr;
		}

		fieldset legend {
			grid-column: 1 / -1;
		}
	}
</style>
