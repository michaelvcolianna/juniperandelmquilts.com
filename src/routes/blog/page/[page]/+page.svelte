<script lang="ts">
	import BlogList from '$lib/components/BlogList.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title="Blog, page {data.listing.page}"
	description="Notes from the studio at Juniper & Elm Quilts."
/>

<section class="block container blog-index">
	<header class="blog-index__head">
		<p class="eyebrow">From the studio</p>
		<h1>Blog</h1>
	</header>
	<BlogList listing={data.listing} />
</section>

<style>
	.blog-index__head {
		margin-block-end: clamp(2rem, 5vw, 3.5rem);
	}

	.blog-index__head .eyebrow {
		margin-block-end: 0.5rem;
	}
</style>
