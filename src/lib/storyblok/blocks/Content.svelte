<script lang="ts">
	import Blok from '../Blok.svelte';
	import type { ContentBlok } from '../types';

	let { blok }: { blok: ContentBlok } = $props();
</script>

{#each blok.body ?? [] as child, index (child._uid)}
	<!-- The first Mantel is the hero, so it gets eager loading and high priority. -->
	<Blok blok={child} priority={index === 0} />
{/each}
