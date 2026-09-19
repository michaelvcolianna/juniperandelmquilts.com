<script lang="ts">
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

<!--
	Descriptions referenced by aria-describedby on external and phone links.
	Carried over from the Nuxt layouts/default.vue.
-->
<div hidden>
	<span id="label-external">Opens an external link in a new window</span>
	<span id="label-phone">Initiates a phone call (if available)</span>
</div>
