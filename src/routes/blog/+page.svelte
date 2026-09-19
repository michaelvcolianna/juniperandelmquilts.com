<script lang="ts">
	import BlogList from '$lib/components/BlogList.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo title="Blog" description="Notes from the studio at Juniper & Elm Quilts." />

<section class="blog-index">
	<h1>Blog</h1>
	<BlogList listing={data.listing} />
</section>
