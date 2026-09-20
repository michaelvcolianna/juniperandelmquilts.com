<script lang="ts">
	import { splitRichText } from './richtext';
	import Blok from './Blok.svelte';
	import type { RichTextDocument } from './types';

	let { content }: { content: RichTextDocument | undefined | null } = $props();

	const parts = $derived(splitRichText(content));
</script>

{#each parts as part (part.key)}
	{#if part.kind === 'blok'}
		<Blok blok={part.blok} />
	{:else}
		<!-- The HTML comes from Storyblok, which only the site owner can author. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="rich-text" id="rich-text-{part.key}">{@html part.html}</div>
	{/if}
{/each}
