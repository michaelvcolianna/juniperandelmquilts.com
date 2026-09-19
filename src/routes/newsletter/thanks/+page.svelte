<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';

	// Where the newsletter endpoint sends people who submit without JavaScript.
	const ok = $derived(page.url.searchParams.get('status') !== 'error');
</script>

<Seo title={ok ? 'Almost there' : 'Signup problem'} />

<section class="newsletter-thanks">
	{#if ok}
		<h1>Almost there</h1>
		<p>
			Thanks for signing up. We've sent you an email — open it and confirm your address to finish
			subscribing.
		</p>
	{:else}
		<h1>That didn't work</h1>
		<p>Something went wrong signing you up. Please try again in a moment.</p>
	{/if}

	<p><a href={resolve('/')}>Back to the home page</a></p>
</section>
