<script lang="ts">
	import { editableAttrs } from '../editable';
	import StoryblokImage from '$lib/components/StoryblokImage.svelte';
	import RichText from '../RichText.svelte';
	import { bestImage, excerpt, storyDate, storyHref } from '$lib/story';
	import type { FeaturedItemsBlok } from '../types';

	let { blok }: { blok: FeaturedItemsBlok } = $props();

	// The Nuxt version guarded on `copy.content.length > 1` to skip the empty
	// paragraph Storyblok leaves behind when the field is cleared.
	const hasCopy = $derived((blok.copy?.content?.length ?? 0) > 1);
	const items = $derived(blok.items ?? []);
	const images = $derived(blok.images ?? []);
</script>

<!--
	eslint-disable svelte/no-navigation-without-resolve --
	hrefs come from storyHref(), which resolves blog routes and falls back to a
	CMS-supplied full_slug for any other story type.
-->

<section {...editableAttrs(blok)} id={blok._uid} class="block block--sunk featured-items">
	<div class="container">
		<div class="featured-items__head">
			<h2>{blok.headline}</h2>

			{#if hasCopy}
				<div class="featured-items__copy">
					<RichText content={blok.copy} />
				</div>
			{/if}
		</div>

		{#if items.length}
			<ul class="featured-items__grid">
				{#each items as story (story.uuid)}
					{@const href = storyHref(story)}
					{@const image = bestImage(story.content)}
					{@const summary = excerpt(story.content)}
					<li>
						<article id="story-{story.id}" class="card">
							<!--
								The Nuxt markup put aria-hidden="true" on this figure, which hid
								the link from screen readers while leaving it keyboard-focusable
								— a WCAG 4.1.2 failure. Instead the image is marked decorative
								and the caption link carries the accessible name.
							-->
							<a {href} tabindex="-1" aria-hidden="true" class="card__image">
								<StoryblokImage
									{image}
									decorative
									aspectRatio={4 / 5}
									sizes="(min-width: 768px) 33vw, 100vw"
								/>
							</a>

							<h3 class="card__title"><a {href}>{story.name}</a></h3>

							{#if story.first_published_at}
								<time datetime={story.first_published_at} class="accent">
									{storyDate(story.first_published_at)}
								</time>
							{/if}

							{#if summary}
								<p class="card__excerpt">{summary}</p>
							{/if}
						</article>
					</li>
				{/each}
			</ul>
		{/if}

		{#if images.length}
			<ul class="featured-items__images">
				{#each images as image (image.filename)}
					<li>
						<StoryblokImage {image} aspectRatio={1} sizes="(min-width: 48em) 38rem, 100vw" />
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<style>
	.featured-items__head {
		max-width: var(--measure);
		margin-block-end: clamp(2rem, 5vw, 3.5rem);
	}

	.featured-items__copy {
		margin-block-start: var(--stack);
	}

	.featured-items__grid,
	.featured-items__images {
		display: grid;
		gap: var(--gutter);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.featured-items__images {
		margin-block-start: var(--gutter);
		/*
		 * Capped so a single featured image does not swell to the full content
		 * width. `sizes` above states this width, so the browser picks a
		 * candidate that is actually sharp at the rendered size.
		 */
		max-width: 38rem;
	}

	.card__image {
		display: block;
	}

	.card__image :global(img) {
		width: 100%;
		border: 1px solid var(--seam);
	}

	.card__title {
		margin-block-start: 1rem;
		font-size: var(--text-h4);
	}

	.card__title a {
		color: var(--ink);
		text-decoration: none;
	}

	.card__title a:hover {
		color: var(--accent);
		text-decoration: underline;
	}

	.card time {
		display: block;
		margin-block-start: 0.35rem;
	}

	.card__excerpt {
		margin-block-start: 0.6rem;
		color: var(--muted);
	}

	@media (min-width: 48em) {
		.featured-items__grid,
		.featured-items__images {
			grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		}
	}
</style>
