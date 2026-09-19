<script lang="ts">
	import Blok from '$lib/storyblok/Blok.svelte';
	import { resolve } from '$app/paths';
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
	<header>
		<h1>{story.name}</h1>

		{#if story.first_published_at}
			<time datetime={story.first_published_at}>{storyDate(story.first_published_at)}</time>
		{/if}
	</header>

	{#if showHero && hero}
		<div class="blog-post__hero">
			<StoryblokImage image={hero} aspectRatio={550 / 350} sizes="100vw" loading="eager" />
		</div>
	{/if}

	{#each story.content.body ?? [] as blok (blok._uid)}
		<Blok {blok} />
	{/each}

	<p class="blog-post__back"><a href={resolve('/blog')}>Back to all posts</a></p>
</article>
