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
