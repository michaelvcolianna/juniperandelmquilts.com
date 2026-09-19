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

<section {...editableAttrs(blok)} id={blok._uid} class="featured-items">
	<div class="featured-items__inner">
		<h2>{blok.headline}</h2>

		{#if hasCopy}
			<div class="featured-items__copy">
				<RichText content={blok.copy} />
			</div>
		{/if}

		{#if items.length}
			<div class="featured-items__grid">
				{#each items as story (story.uuid)}
					{@const href = storyHref(story)}
					{@const image = bestImage(story.content)}
					{@const summary = excerpt(story.content)}
					<article id="story-{story.id}">
						<figure>
							<!--
								The Nuxt markup put aria-hidden="true" on this figure, which hid
								the link from screen readers while leaving it keyboard-focusable
								— a WCAG 4.1.2 failure. Instead the image is marked decorative
								and the caption link carries the accessible name.
							-->
							<a {href} tabindex="-1" aria-hidden="true">
								<StoryblokImage
									{image}
									decorative
									aspectRatio={340 / 450}
									sizes="(min-width: 768px) 50vw, 100vw"
								/>
							</a>

							<figcaption>
								<a {href}>{story.name}</a>

								{#if summary}
									<p>{summary}</p>
								{/if}

								{#if story.first_published_at}
									<time datetime={story.first_published_at}>
										{storyDate(story.first_published_at)}
									</time>
								{/if}
							</figcaption>
						</figure>
					</article>
				{/each}
			</div>
		{/if}

		{#if images.length}
			<div class="featured-items__images">
				{#each images as image (image.filename)}
					<StoryblokImage {image} sizes="(min-width: 768px) 50vw, 100vw" />
				{/each}
			</div>
		{/if}
	</div>
</section>
