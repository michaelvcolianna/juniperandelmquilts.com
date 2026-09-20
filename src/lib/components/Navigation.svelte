<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import ExternalLink from './ExternalLink.svelte';
	import { ETSY_SHOP_URL } from '$lib/site';

	interface Props {
		inFooter?: boolean;
		id?: string;
	}

	let { inFooter = false, id }: Props = $props();

	type NavLink =
		| { kind: 'internal'; href: string; label: string }
		| { kind: 'external'; href: string; label: string };

	/*
	 * Internal entries use route ids, so a renamed route fails the build rather
	 * than shipping a dead link.
	 *
	 * "Shop" is external for now because selling happens on Etsy. When the Square
	 * catalog lands, this becomes `{ kind: 'internal', href: resolve('/shop') }`
	 * and nothing else here has to change.
	 */
	const links: NavLink[] = [
		{ kind: 'internal', href: resolve('/'), label: 'Home' },
		{ kind: 'internal', href: resolve('/blog'), label: 'Blog' },
		{ kind: 'internal', href: resolve('/contact'), label: 'Contact' },
		// Last, so the two off-site destinations — Shop and Instagram — sit
		// together at the end of the nav.
		{ kind: 'external', href: ETSY_SHOP_URL, label: 'Shop' }
	];

	function isCurrent(link: NavLink): boolean {
		// An off-site link is never the current page.
		if (link.kind === 'external') return false;

		return link.href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(link.href);
	}
</script>

<nav {id} aria-label={inFooter ? 'Site areas, footer' : 'Site areas'} class:in-footer={inFooter}>
	{#each links as link (link.href)}
		{#if link.kind === 'external'}
			<!--
				ExternalLink carries the rel and the aria-describedby that points at
				the "opens in a new window" description in the layout.
			-->
			<ExternalLink href={link.href} nofollow={false}>
				{link.label}<span class="external-mark" aria-hidden="true">↗</span>
			</ExternalLink>
		{:else}
			<!-- These hrefs come from resolve() in the links array above; the rule
			     cannot see through the union type to confirm it. -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href={link.href} aria-current={isCurrent(link) ? 'page' : undefined}>
				{link.label}
			</a>
		{/if}
	{/each}
</nav>

<style>
	nav {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}

	/*
	 * :global because ExternalLink renders its own anchor in a different
	 * component, which Svelte's scoping would otherwise leave unstyled.
	 */
	nav :global(a) {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-target);
		color: var(--ink);
		font-size: var(--text-h4);
		font-family: var(--font-heading);
		text-decoration: none;
	}

	nav :global(a:hover) {
		color: var(--accent);
	}

	/* The current page is marked with an underline, not colour alone. */
	nav :global(a[aria-current='page']) {
		box-shadow: inset 0 -2px 0 var(--accent);
	}

	/* Signals that the link leaves the site, alongside the screen-reader hint. */
	.external-mark {
		margin-inline-start: 0.2em;
		font-size: 0.7em;
		/* Optical alignment: the glyph sits high in its box. */
		transform: translateY(-0.15em);
	}

	.in-footer {
		align-items: flex-start;
	}

	.in-footer :global(a) {
		color: var(--paper);
		font-size: var(--text-base);
		font-family: var(--font-body);
	}

	.in-footer :global(a:hover) {
		color: var(--seam);
	}

	@media (min-width: 64em) {
		nav {
			flex-direction: row;
			gap: 2rem;
		}

		nav :global(a) {
			font-family: var(--font-body);
			font-size: var(--text-base);
		}

		.in-footer {
			flex-direction: column;
			gap: 0.75rem;
		}
	}
</style>
