<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import { resolve } from '$app/paths';

	const title = $derived(page.status === 404 ? 'Page not found' : 'Something went wrong');
</script>

<Seo {title} />

<section class="error-page">
	<h1>{title}</h1>

	{#if page.status === 404}
		<p>We couldn't find that page. It may have moved, or the address may be slightly off.</p>
	{:else}
		<p>{page.error?.message ?? 'Please try again in a moment.'}</p>
	{/if}

	<p><a href={resolve('/')}>Back to the home page</a></p>
</section>
