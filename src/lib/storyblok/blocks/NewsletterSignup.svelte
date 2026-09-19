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

<!--
	Like the Mantel, the image and the form are separate pieces rather than text
	laid over a dimmed photo. The old block blurred the image to 50% brightness
	and 50% contrast to make white text readable over it; here the copy sits on
	ink at 16.3:1 and the quilt stays sharp.
-->
<section {...editableAttrs(blok)} id={blok._uid} class="block block--ink newsletter">
	<div class="container newsletter__inner">
		<div class="newsletter__image">
			<StoryblokImage image={blok.image} decorative sizes="(min-width: 768px) 45vw, 100vw" />
		</div>

		<div class="newsletter__main">
			<h2>{blok.headline}</h2>
			{#if blok.copy}
				<p class="newsletter__copy">{blok.copy}</p>
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

			<p class="newsletter__note accent">
				We'll send a confirmation email. No spam, and you can unsubscribe at any time.
			</p>

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
	</div>
</section>

<style>
	.newsletter__inner {
		display: grid;
		gap: clamp(1.5rem, 5vw, 3rem);
		align-items: center;
	}

	.newsletter__image :global(img) {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.newsletter__copy {
		margin-block-start: var(--stack);
		color: var(--seam);
	}

	form {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: end;
		margin-block-start: clamp(1.5rem, 3vw, 2rem);
	}

	.newsletter__field {
		flex: 1 1 14rem;
	}

	.newsletter__note {
		margin-block-start: 0.85rem;
	}

	.newsletter__result {
		margin-block-start: 1rem;
		padding: 0.85rem 1rem;
		border-left: 3px solid var(--seam);
		background-color: rgb(255 255 255 / 0.07);
	}

	.newsletter__result--error {
		border-left-color: var(--accent);
	}

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

	@media (min-width: 48em) {
		.newsletter__inner {
			grid-template-columns: 5fr 6fr;
			column-gap: var(--gutter);
		}
	}
</style>
