<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		class?: string;
		children: Snippet;
	}

	let { href, class: className = '', children }: Props = $props();

	const isPhone = $derived(/^tel:/i.test(href));
</script>

<!--
	eslint-disable svelte/no-navigation-without-resolve --
	Every href here is an external URL or a tel: link, so there is no internal
	route to resolve against.
-->

{#if isPhone}
	<a {href} class={className} aria-describedby="label-phone">{@render children()}</a>
{:else}
	<a
		{href}
		class={className}
		target="_blank"
		rel="noopener noreferrer nofollow"
		aria-describedby="label-external"
	>
		{@render children()}
	</a>
{/if}
