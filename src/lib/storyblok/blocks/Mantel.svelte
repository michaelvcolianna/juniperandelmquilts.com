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

	<div class="mantel__text">
		<h1>{blok.headline}</h1>
		{#if blok.copy}
			<p>{blok.copy}</p>
		{/if}
	</div>
</section>
