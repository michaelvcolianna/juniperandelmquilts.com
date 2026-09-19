<script lang="ts">
	import { editableAttrs } from '../editable';
	import StoryblokImage from '$lib/components/StoryblokImage.svelte';
	import type { ImageGalleryBlok } from '../types';

	let { blok }: { blok: ImageGalleryBlok } = $props();
</script>

<ul {...editableAttrs(blok)} id={blok._uid} class="image-gallery">
	{#each blok.images ?? [] as image (image.filename)}
		<li>
			<StoryblokImage {image} aspectRatio={1} sizes="(min-width: 768px) 25vw, 50vw" />
		</li>
	{/each}
</ul>

<style>
	/*
	 * The most literal piece of the system: square tiles butted together with a
	 * seam-width gap, so the grid itself reads as patchwork.
	 */
	.image-gallery {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2px;
		margin: 0;
		padding: 0;
		list-style: none;
		background-color: var(--seam);
		border-block: 1px solid var(--seam);
	}

	.image-gallery :global(img) {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
	}

	@media (min-width: 48em) {
		.image-gallery {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
