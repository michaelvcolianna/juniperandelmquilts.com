<script lang="ts">
	/*
	 * Self-hosted, so the browser never opens a connection to a font CDN. These
	 * are the weight-axis-only variable files: one file per family covers every
	 * weight the design uses, and the `unicode-range` splits mean only the latin
	 * subset is actually fetched.
	 */
	import '@fontsource-variable/inter/wght.css';
	import '@fontsource-variable/inter/wght-italic.css';
	import '@fontsource-variable/newsreader/wght.css';
	import '@fontsource-variable/newsreader/wght-italic.css';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<a href="#content" class="skip-nav">Skip to content</a>

<Header />

<main id="content" tabindex="-1">
	{@render children()}
</main>

<Footer />

<div hidden>
	<span id="label-external">Opens an external link in a new window</span>
	<span id="label-phone">Initiates a phone call (if available)</span>
</div>
