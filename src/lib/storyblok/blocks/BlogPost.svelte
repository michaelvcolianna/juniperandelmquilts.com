<script lang="ts">
	import { editableAttrs } from '../editable';
	import RichText from '../RichText.svelte';
	import type { BlogPostBlok } from '../types';

	let { blok }: { blok: BlogPostBlok } = $props();
</script>

<section {...editableAttrs(blok)} id="blog-content">
	<RichText content={blok.body} />
</section>
