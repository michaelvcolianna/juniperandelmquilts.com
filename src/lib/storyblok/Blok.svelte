<script lang="ts">
	import { dev } from '$app/environment';
	import { getBlockComponent, knownBlockNames } from './componentMap';
	import type { Blok } from './types';

	let { blok, ...rest }: { blok: Blok; [key: string]: unknown } = $props();

	const Component = $derived(getBlockComponent(blok.component));
</script>

{#if Component}
	<Component {blok} {...rest} />
{:else if dev}
	<!-- Surfaced in development so a new Storyblok component isn't silently dropped. -->
	<p data-unknown-blok={blok.component}>
		No Svelte component is registered for the Storyblok block
		<code>{blok.component}</code>. Known blocks: {knownBlockNames().join(', ')}.
	</p>
{/if}
