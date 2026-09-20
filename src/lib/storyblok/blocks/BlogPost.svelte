<script lang="ts">
	import { editableAttrs } from '../editable';
	import RichText from '../RichText.svelte';
	import type { BlogPostBlok } from '../types';

	let { blok }: { blok: BlogPostBlok } = $props();
</script>

<section {...editableAttrs(blok)} id="blog-content" class="blog-content">
	<RichText content={blok.body} />
</section>

<style>
	.blog-content {
		display: grid;
		gap: 1em;
	}
</style>
