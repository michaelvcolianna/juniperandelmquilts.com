<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	interface Props {
		inFooter?: boolean;
		id?: string;
	}

	let { inFooter = false, id }: Props = $props();

	// Route ids rather than raw strings, so a renamed route fails the build.
	const links = [
		{ href: resolve('/'), label: 'Home' },
		{ href: resolve('/blog'), label: 'Blog' },
		{ href: resolve('/contact'), label: 'Contact' }
	];

	function isCurrent(href: string): boolean {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}
</script>

<nav {id} aria-label={inFooter ? 'Site areas, footer' : 'Site areas'} class:in-footer={inFooter}>
	{#each links as link (link.href)}
		<a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
			{link.label}
		</a>
	{/each}
</nav>

<style>
	nav {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}

	a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-target);
		color: var(--ink);
		font-size: var(--text-h4);
		font-family: var(--font-heading);
		text-decoration: none;
	}

	a:hover {
		color: var(--accent);
	}

	/* The current page is marked with a seam-coloured underline, not colour alone. */
	a[aria-current='page'] {
		box-shadow: inset 0 -2px 0 var(--accent);
	}

	.in-footer a {
		color: var(--paper);
		font-size: var(--text-base);
		font-family: var(--font-body);
	}

	.in-footer a:hover {
		color: var(--seam);
	}

	@media (min-width: 64em) {
		nav {
			flex-direction: row;
			gap: 2rem;
		}

		a {
			font-family: var(--font-body);
			font-size: var(--text-base);
		}
	}

	@media (min-width: 64em) {
		.in-footer {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}
	}
</style>
