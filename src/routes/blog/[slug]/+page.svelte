<script lang="ts">
	import { resolve } from '$app/paths';
	import Blok from '$lib/storyblok/Blok.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import StoryblokImage from '$lib/components/StoryblokImage.svelte';
	import { bestImage, excerpt, showsHero, storyDate } from '$lib/story';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const story = $derived(data.story);
	const summary = $derived(excerpt(story.content));
	const hero = $derived(bestImage(story.content));
	const showHero = $derived(showsHero(story.content));
</script>

<Seo
	title={story.name}
	description={summary}
	image={hero}
	type="article"
	publishedAt={story.first_published_at}
/>

<article class="blog-post">
	<header class="container blog-post__head">
		<h1>{story.name}</h1>

		{#if story.first_published_at}
			<time datetime={story.first_published_at} class="accent">
				{storyDate(story.first_published_at)}
			</time>
		{/if}
	</header>

	{#if showHero && hero}
		<div class="blog-post__hero">
			<StoryblokImage image={hero} aspectRatio={16 / 9} sizes="100vw" loading="eager" />
		</div>
	{/if}

	<div class="container blog-post__body">
		{#each story.content.body ?? [] as blok (blok._uid)}
			<Blok {blok} />
		{/each}
	</div>

	<div class="container blog-post__foot">
		<a href={resolve('/blog')}>&larr; Back to all posts</a>
	</div>
</article>

<style>
	.blog-post {
		/*
		 * Wider than --prose-width, which is tuned for short intro copy. Long-form
		 * posts read better nearer 72 characters, and it gives embedded blocks
		 * room to breathe.
		 */
		--blog-measure: 46rem;
	}

	/* Shared by the header, body and footer so the column edge is continuous. */
	.blog-post__head,
	.blog-post__body,
	.blog-post__foot {
		max-width: calc(var(--blog-measure) + var(--gutter) * 2);
	}

	.blog-post__head {
		padding-block: clamp(2.5rem, 7vw, 4.5rem) clamp(1.5rem, 4vw, 2.5rem);
	}

	.blog-post__head time {
		display: block;
		margin-block-start: 0.75rem;
	}

	.blog-post__hero :global(img) {
		width: 100%;
		object-fit: cover;
	}

	/*
	 * Post bodies are a single measured column rather than the wide page grid.
	 * The old build set this to 80vw on small screens, which produced very long
	 * lines on tablets.
	 */
	.blog-post__body {
		padding-block: clamp(2rem, 6vw, 3.5rem);
	}

	.blog-post__foot {
		padding-block-end: var(--block-space);
	}

	.blog-post__foot a {
		font-weight: 500;
	}
</style>
