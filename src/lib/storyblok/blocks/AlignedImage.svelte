<script lang="ts">
	import { editableAttrs } from '../editable';
	import StoryblokImage from '$lib/components/StoryblokImage.svelte';
	import RichText from '../RichText.svelte';
	import type { AlignedImageBlok } from '../types';

	let { blok }: { blok: AlignedImageBlok } = $props();

	/*
	 * The stored values are still `right` and `left`, left over from when this
	 * block floated its image to one side. It no longer does — it is only ever
	 * embedded in a blog post's prose column, where there is no room for two
	 * columns — so the field now controls whether the image sits above or below
	 * the text instead:
	 *
	 *   right -> image on top     (what every existing block is set to, so
	 *                              published content renders unchanged)
	 *   left  -> image underneath
	 *
	 * The Storyblok labels read "Image top" / "Image bottom"; only the underlying
	 * values kept their old names, which avoided migrating existing content.
	 */
	const imageFirst = $derived(blok.alignment !== 'left');
</script>

{#snippet imageBlock()}
	<div class="aligned-image__image">
		<StoryblokImage image={blok.image} sizes="(min-width: 48em) 46rem, 100vw" />
	</div>
{/snippet}

{#snippet textBlock()}
	<div class="aligned-image__text">
		<RichText content={blok.content} />
	</div>
{/snippet}

<!--
	This block deliberately does NOT carry `.block` or `.container`:

	  - `.block` adds a seam border-top, which appeared as a second rule directly
	    beneath any editor-inserted <hr>.
	  - `.container` adds padding-inline, indenting it inside a prose column that
	    is already padded.

	Order is set in the markup rather than with CSS `order` or `grid-row`, so the
	reading order a screen reader announces matches what is on screen.
-->
<div {...editableAttrs(blok)} id={blok._uid} class="aligned-image">
	{#if blok.title}
		<h2 class="aligned-image__title">{blok.title}</h2>
	{/if}

	{#if imageFirst}
		{@render imageBlock()}
		{@render textBlock()}
	{:else}
		{@render textBlock()}
		{@render imageBlock()}
	{/if}
</div>

<style>
	.aligned-image {
		display: grid;
		gap: var(--stack);
		margin-block: clamp(2rem, 5vw, 3rem);
	}

	.aligned-image__title {
		font-size: var(--text-h3);
	}

	.aligned-image__image :global(img) {
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		border: 1px solid var(--seam);
	}
</style>
