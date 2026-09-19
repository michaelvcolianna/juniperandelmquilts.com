<script lang="ts">
	import { editableAttrs } from '../editable';
	import StoryblokImage from '$lib/components/StoryblokImage.svelte';
	import type { AccentImageBlok } from '../types';

	let { blok }: { blok: AccentImageBlok } = $props();
</script>

<!-- Purely decorative band; hidden from assistive tech, as in the Nuxt build. -->
<section {...editableAttrs(blok)} id={blok._uid} class="accent-image" aria-hidden="true">
	<StoryblokImage image={blok.image} decorative sizes="100vw" />
</section>
