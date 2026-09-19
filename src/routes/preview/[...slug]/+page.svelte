<script lang="ts">
	import { onMount } from 'svelte';
	import Blok from '$lib/storyblok/Blok.svelte';
	import type { Story } from '$lib/storyblok/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// A writable $derived: reads through to the loaded story, but the bridge can
	// assign edited content straight over it without a server round trip, and it
	// resets automatically when the editor navigates to another story.
	let story = $derived<Story>(data.story);

	onMount(async () => {
		const { loadStoryblokBridge, useStoryblokBridge } = await import('@storyblok/js');

		await loadStoryblokBridge();
		useStoryblokBridge(story.id, (updated) => {
			story = updated as unknown as Story;
		});
	});
</script>

<svelte:head>
	<!-- Draft content must never be indexed. -->
	<meta name="robots" content="noindex, nofollow" />
	<title>Preview: {story.name}</title>
</svelte:head>

<Blok blok={story.content} />
