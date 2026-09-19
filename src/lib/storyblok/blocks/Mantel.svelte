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

<!--
	The Nuxt Mantel laid the headline over the image and made it readable by
	blurring the photo, dropping it to 65% brightness, desaturating it and adding
	two text-shadows — hiding the quilt to rescue the text, and still landing on
	unpredictable contrast because the ratio depended on whichever pixels sat
	behind the words.

	Here the image and the text are separate pieces of the patchwork. The quilt is
	shown sharp and uncropped, and the headline sits on paper at a fixed 16.3:1.
-->
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
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		color: var(--muted);
	}

	@media (min-width: 48em) {
		.mantel__image :global(img) {
			aspect-ratio: 21 / 9;
		}

		/* The headline sits in the left columns, the way a pieced panel would. */
		.mantel__text {
			display: grid;
			grid-template-columns: repeat(12, minmax(0, 1fr));
			column-gap: var(--gutter);
		}

		.mantel__text h1 {
			grid-column: 1 / span 7;
		}

		.mantel__copy {
			grid-column: 8 / span 5;
			margin-block-start: 0;
			align-self: end;
		}
	}
</style>
