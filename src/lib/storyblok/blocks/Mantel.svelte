<script lang="ts">
	import { editableAttrs } from '../editable';
	import StoryblokImage from '$lib/components/StoryblokImage.svelte';
	import type { MantelBlok } from '../types';

	interface Props {
		blok: MantelBlok;
		/** The first Mantel on a page is the LCP element, so it loads eagerly. */
		priority?: boolean;
	}

	let { blok, priority = false }: Props = $props();
</script>

<section {...editableAttrs(blok)} id={blok._uid} class="mantel">
	<div class="mantel__image">
		<StoryblokImage
			image={blok.image}
			decorative
			sizes="100vw"
			loading={priority ? 'eager' : 'lazy'}
			fetchpriority={priority ? 'high' : 'auto'}
		/>
	</div>

	<div class="container mantel__text">
		<h1>{blok.headline}</h1>
		{#if blok.copy}
			<p class="mantel__copy">{blok.copy}</p>
		{/if}
	</div>
</section>

<style>
	/*
	 * The seam sits on the image, not on the text below it: .mantel__text is a
	 * .container, so a border there would stop at the content width instead of
	 * running edge to edge like every other seam on the page.
	 */
	.mantel__image {
		border-bottom: 1px solid var(--seam);
	}

	.mantel__image :global(img) {
		width: 100%;
		aspect-ratio: 4 / 3;
		max-height: 80svh;
		object-fit: cover;
	}

	.mantel__text {
		padding-block: clamp(2rem, 6vw, 4rem);
	}

	.mantel__copy {
		max-width: var(--prose-width);
		margin-block-start: var(--stack);
		/* Avoids the one-word last line visible at these widths. */
		text-wrap: pretty;
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		color: var(--muted);
	}

	@media (min-width: 48em) {
		.mantel__image :global(img) {
			aspect-ratio: 21 / 9;
		}
	}

	/*
	 * Headline and copy stay stacked through tablet — side by side they leave the
	 * headline only seven of twelve columns, which is not enough width for it at
	 * that size. They split at the desktop breakpoint instead.
	 */
	/*
	 * Side by side only once both lines genuinely fit. Measured at the current
	 * type scale, the headline needs 537px and the copy 384px — 921px together,
	 * against 896px of usable width at 1024px. Splitting there forces one of them
	 * to wrap whatever ratio the tracks use; a 12-column grid gave the shortfall
	 * to the headline, and 2fr/1fr gave it to the copy. From ~1120px up there is
	 * room for both, so that is where the split starts. Below it they stack,
	 * where each gets the full width.
	 *
	 * The second track is sized to its content rather than a fixed fraction, so a
	 * longer headline takes the slack instead of pushing the copy into a wrap.
	 */
	@media (min-width: 70em) {
		.mantel__text {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, auto);
			column-gap: var(--stack);
			/*
			 * Centred against the headline rather than sharing its baseline.
			 *
			 * `end` lined up the box bottoms, which left the baselines 6-9px apart
			 * because the copy's 1.6 line-height carries far more leading below its
			 * baseline than the headline's 1.12 does.
			 */
			align-items: center;
		}

		.mantel__copy {
			margin-block-start: 0;
		}
	}
</style>
