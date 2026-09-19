<script lang="ts">
	import { page } from '$app/state';
	import Navigation from './Navigation.svelte';
	import SocialMedia from './SocialMedia.svelte';
	import Wordmark from './Wordmark.svelte';
	import { resolve } from '$app/paths';

	/** Above this width the nav is always visible and the toggle is hidden. */
	const DESKTOP = 1024;

	let open = $state(false);
	let toggleEl = $state<HTMLButtonElement | null>(null);
	let navEl = $state<HTMLElement | null>(null);

	// The Nuxt build flipped a `.menu-open` class on <html>, which swapped a set
	// of custom properties and locked scrolling. Kept, so the CSS can do the same.
	$effect(() => {
		document.documentElement.classList.toggle('menu-open', open);
		return () => document.documentElement.classList.remove('menu-open');
	});

	// Close on navigation, so following a link doesn't leave the menu open.
	// The pathname is assigned to a local so the read is unambiguously tracked.
	$effect(() => {
		const pathname = page.url.pathname;
		if (pathname) open = false;
	});

	function close(returnFocus = false) {
		open = false;
		if (returnFocus) toggleEl?.focus();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) close(true);
	}

	function onPointerDown(event: PointerEvent) {
		if (!open) return;

		const target = event.target as Node;
		if (navEl?.contains(target) || toggleEl?.contains(target)) return;

		close();
	}

	function onResize() {
		if (window.innerWidth >= DESKTOP) open = false;
	}
</script>

<svelte:window onkeydown={onKeydown} onpointerdown={onPointerDown} onresize={onResize} />

<header class="site-header">
	<button
		bind:this={toggleEl}
		id="menu-toggle"
		type="button"
		class="site-header__toggle"
		aria-controls="main-nav"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		<span class="sr-only">{open ? 'Hide menu' : 'Show menu'}</span>
		<span class="site-header__bars" aria-hidden="true"></span>
	</button>

	<a href={resolve('/')} class="site-header__logo">
		<Wordmark />
		<span class="sr-only">Juniper &amp; Elm Quilts</span>
	</a>

	<div bind:this={navEl} id="main-nav" class="site-header__nav" class:is-open={open}>
		<Navigation />
		<SocialMedia />
	</div>
</header>
