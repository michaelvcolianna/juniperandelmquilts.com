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
