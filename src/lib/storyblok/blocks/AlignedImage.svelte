<script lang="ts">
	import { editableAttrs } from '../editable';
	import StoryblokImage from '$lib/components/StoryblokImage.svelte';
	import RichText from '../RichText.svelte';
	import type { AlignedImageBlok } from '../types';

	let { blok }: { blok: AlignedImageBlok } = $props();
</script>

<div
	{...editableAttrs(blok)}
	id={blok._uid}
	class="aligned-image aligned-image--{blok.alignment ?? 'left'}"
>
	{#if blok.title}
		<h2>{blok.title}</h2>
	{/if}

	<div class="aligned-image__image">
		<StoryblokImage image={blok.image} sizes="(min-width: 768px) 50vw, 100vw" />
	</div>

	<div class="aligned-image__text">
		<RichText content={blok.content} />
	</div>
</div>
