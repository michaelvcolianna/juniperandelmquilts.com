<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		/**
		 * `nofollow` suits incidental outbound links — the footer credits, the
		 * "powered by" mentions. Set it false for a destination that genuinely
		 * belongs to this business, such as the Etsy shop: telling search engines
		 * not to associate the two works against her.
		 */
		nofollow?: boolean;
		class?: string;
		children: Snippet;
	}

	let { href, nofollow = true, class: className = '', children }: Props = $props();

	const isPhone = $derived(/^tel:/i.test(href));
	const rel = $derived(nofollow ? 'noopener noreferrer nofollow' : 'noopener noreferrer');
</script>

<!--
	eslint-disable svelte/no-navigation-without-resolve --
	Every href here is an external URL or a tel: link, so there is no internal
	route to resolve against.
-->
{#if isPhone}
	<a {href} class={className} aria-describedby="label-phone">{@render children()}</a>
{:else}
	<a {href} class={className} target="_blank" {rel} aria-describedby="label-external">
		{@render children()}
	</a>
{/if}
