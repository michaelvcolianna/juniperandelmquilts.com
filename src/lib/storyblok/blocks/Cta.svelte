<script lang="ts">
	import { editableAttrs } from '../editable';
	import ExternalLink from '$lib/components/ExternalLink.svelte';
	import type { CtaBlok } from '../types';

	let { blok }: { blok: CtaBlok } = $props();

	const PROFILE = 'https://www.instagram.com/juniperandelmquilts';
</script>

<section {...editableAttrs(blok)} id={blok._uid} class="block block--ink cta">
	<div class="container cta__inner">
		<div class="cta__text">
			<h2>{blok.headline}</h2>
			{#if blok.copy}
				<p class="cta__copy">{blok.copy}</p>
			{/if}
		</div>

		<p class="cta__action">
			<ExternalLink href={PROFILE} class="button cta__link">Follow us on Instagram</ExternalLink>
		</p>
	</div>
</section>

<style>
	.cta__inner {
		display: grid;
		gap: clamp(1.5rem, 4vw, 2.5rem);
	}

	.cta__text {
		max-width: var(--measure);
	}

	.cta__copy {
		margin-block-start: var(--stack);
		color: var(--seam);
	}

	.cta__action {
		margin: 0;
	}

	/*
	 * The button is paper-on-accent (5.6:1) rather than inheriting the inverted
	 * block's link colour, so it still reads as a control on the dark surface.
	 */
	.cta__inner :global(.cta__link) {
		color: var(--paper);
		text-decoration: none;
	}

	@media (min-width: 48em) {
		.cta__inner {
			grid-template-columns: 1fr auto;
			align-items: center;
			column-gap: var(--gutter);
		}
	}
</style>
