<script lang="ts">
	import { editableAttrs } from '../editable';
	import { tick } from 'svelte';
	import StoryblokImage from '$lib/components/StoryblokImage.svelte';
	import type { NewsletterSignupBlok } from '../types';

	let { blok }: { blok: NewsletterSignupBlok } = $props();

	type Status = 'idle' | 'submitting' | 'success' | 'error';

	// This block is rendered on prerendered pages, so it must not read the query
	// string — the URL isn't known at build time. Without JS the form submits
	// normally and the endpoint redirects to /newsletter/thanks, which is where
	// the no-script confirmation lives.
	let status = $state<Status>('idle');
	let message = $state('');
	let resultEl = $state<HTMLElement | null>(null);

	const effectiveStatus = $derived(status);

	const SUCCESS = 'Thanks! Check your inbox and confirm your address to finish signing up.';
	const FAILURE = 'Something went wrong signing you up. Please try again in a moment.';

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		const form = event.currentTarget as HTMLFormElement;
		status = 'submitting';

		try {
			const response = await fetch(form.action, {
				method: 'POST',
				headers: { accept: 'application/json' },
				body: new FormData(form)
			});

			if (response.ok) {
				status = 'success';
				message = SUCCESS;
				form.reset();
			} else {
				status = 'error';
				message = FAILURE;
			}
		} catch {
			status = 'error';
			message = FAILURE;
		}

		// Move focus to the result so screen reader users hear the outcome.
		await tick();
		resultEl?.focus();
	}
</script>

<section {...editableAttrs(blok)} id={blok._uid} class="newsletter">
	<div class="newsletter__image">
		<StoryblokImage image={blok.image} decorative sizes="100vw" />
	</div>

	<div class="newsletter__main">
		<h2>{blok.headline}</h2>
		{#if blok.copy}
			<p>{blok.copy}</p>
		{/if}

		<form method="POST" action="/newsletter" onsubmit={handleSubmit}>
			<div class="newsletter__field">
				<label for="newsletter-email">Email address</label>
				<input
					id="newsletter-email"
					name="email"
					type="email"
					required
					autocomplete="email"
					autocapitalize="off"
					autocorrect="off"
					spellcheck="false"
					disabled={effectiveStatus === 'submitting'}
				/>
			</div>

			<!-- Honeypot: hidden from people, tempting to bots. -->
			<div class="newsletter__hp" aria-hidden="true">
				<label for="newsletter-website">Leave this field empty</label>
				<input
					id="newsletter-website"
					name="website"
					type="text"
					tabindex="-1"
					autocomplete="off"
				/>
			</div>

			<button type="submit" disabled={effectiveStatus === 'submitting'}>
				{effectiveStatus === 'submitting' ? 'Signing up…' : 'Sign up'}
			</button>
		</form>

		{#if effectiveStatus === 'success' || effectiveStatus === 'error'}
			<p
				bind:this={resultEl}
				tabindex="-1"
				role="status"
				class="newsletter__result newsletter__result--{effectiveStatus}"
			>
				{message || (effectiveStatus === 'success' ? SUCCESS : FAILURE)}
			</p>
		{/if}
	</div>
</section>

<style>
	/* Visually hidden but still reachable by bots that fill every input. */
	.newsletter__hp {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
