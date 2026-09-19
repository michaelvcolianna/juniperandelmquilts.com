<script lang="ts">
	import { editableAttrs } from '../editable';
	import StoryblokImage from '$lib/components/StoryblokImage.svelte';
	import RichText from '../RichText.svelte';
	import type { AlignedImageBlok } from '../types';

	let { blok }: { blok: AlignedImageBlok } = $props();
</script>

<!--
	The Nuxt version wrapped text around the image with CSS floats, disabling them
	below 768px. Two pieces sitting side by side in the grid gives the same
	reading order, holds its alignment at every width, and keeps the image from
	being squeezed into an awkward column on the way down.
-->
<div
	{...editableAttrs(blok)}
	id={blok._uid}
	class="block container aligned-image aligned-image--{blok.alignment ?? 'left'}"
>
	{#if blok.title}
		<h2 class="aligned-image__title">{blok.title}</h2>
	{/if}

	<div class="aligned-image__image">
		<StoryblokImage image={blok.image} sizes="(min-width: 768px) 50vw, 100vw" />
	</div>

	<div class="aligned-image__text">
		<RichText content={blok.content} />
	</div>
</div>

<style>
	.aligned-image {
		display: grid;
		gap: var(--stack);
	}

	.aligned-image__image :global(img) {
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
	}

	@media (min-width: 48em) {
		.aligned-image {
			grid-template-columns: repeat(12, minmax(0, 1fr));
			column-gap: var(--gutter);
			row-gap: clamp(1.5rem, 3vw, 2.5rem);
			align-items: center;
		}

		.aligned-image__title {
			grid-column: 1 / -1;
		}

		/* Image left, text right. */
		.aligned-image--left .aligned-image__image {
			grid-column: 1 / span 6;
		}

		.aligned-image--left .aligned-image__text {
			grid-column: 8 / span 5;
		}

		/*
		 * Image right, text left. Only the grid placement swaps — the DOM order is
		 * unchanged, so the reading and tab order stay the same in both variants.
		 */
		.aligned-image--right .aligned-image__image {
			grid-column: 7 / span 6;
			grid-row: 2;
		}

		.aligned-image--right .aligned-image__text {
			grid-column: 1 / span 5;
			grid-row: 2;
		}
	}
</style>
