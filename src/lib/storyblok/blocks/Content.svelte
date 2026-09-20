<script lang="ts">
	import Blok from '../Blok.svelte';
	import type { ContentBlok } from '../types';

	let { blok }: { blok: ContentBlok } = $props();
</script>

<!--
	Deliberately has no editable wrapper. The Nuxt version wrapped this in a
	`<div v-editable>`, but `content` is only a page-level container whose sole
	field is the list of blocks below — selecting it in the editor achieves
	nothing, and the extra div would be a permanent obstacle for the layout grid.
	Every child block is individually selectable.
-->
{#each blok.body ?? [] as child, index (child._uid)}
	<!-- The first Mantel is the hero, so it gets eager loading and high priority. -->
	<Blok blok={child} priority={index === 0} />
{/each}
