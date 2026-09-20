<script lang="ts">
	import { editableAttrs } from '../editable';
	import StoryblokImage from '$lib/components/StoryblokImage.svelte';
	import type { AccentImageBlok } from '../types';

	let { blok }: { blok: AccentImageBlok } = $props();
</script>

<!-- Purely decorative band; hidden from assistive tech, as in the Nuxt build. -->
<section {...editableAttrs(blok)} id={blok._uid} class="accent-image" aria-hidden="true">
	<!--
		A single 2:1 crop serves both breakpoints: object-fit trims it to 3:2 on
		small screens and 3:1 on large ones. Without an explicit ratio the CDN
		returned the full portrait source — 1706px tall for a 427px band.
	-->
	<StoryblokImage image={blok.image} decorative aspectRatio={2} sizes="100vw" />
</section>

<style>
	/* A full-bleed band of colour and texture between text blocks. */
	.accent-image {
		border-top: 1px solid var(--seam);
	}

	.accent-image :global(img) {
		width: 100%;
		aspect-ratio: 3 / 2;
		max-height: 60svh;
		object-fit: cover;
	}

	@media (min-width: 48em) {
		.accent-image {
			border-top: 1px solid var(--seam);
		}

		.accent-image :global(img) {
			aspect-ratio: 3 / 1;
		}
	}
</style>
