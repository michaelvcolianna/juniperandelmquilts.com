<script lang="ts">
	import Blok from '$lib/storyblok/Blok.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo description={data.story.content.description} image={data.story.content.card} />

<Blok blok={data.story.content} />
