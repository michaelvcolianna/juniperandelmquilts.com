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

	// The old build flipped a `.menu-open` class on <html>, which swapped a set
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

<style>
	/*
	 * Deliberately not sticky. WCAG 2.2's 2.4.11 (Focus Not Obscured) is most
	 * often failed by a sticky header covering a focused element, and a calm
	 * editorial site gains little from one. Staying static satisfies it outright.
	 */
	.site-header {
		display: grid;
		grid-template-columns: var(--tap-target) 1fr var(--tap-target);
		align-items: center;
		gap: 1rem;
		padding: 1rem var(--gutter);
		border-bottom: 1px solid var(--seam);
	}

	.site-header__toggle {
		display: grid;
		place-items: center;
		width: var(--tap-target);
		height: var(--tap-target);
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
	}

	/* Three bars, drawn from one element plus its two pseudo-elements. */
	.site-header__bars,
	.site-header__bars::before,
	.site-header__bars::after {
		display: block;
		width: 1.5rem;
		height: 2px;
		background-color: var(--ink);
	}

	.site-header__bars {
		position: relative;
	}

	.site-header__bars::before,
	.site-header__bars::after {
		content: '';
		position: absolute;
		left: 0;
	}

	.site-header__bars::before {
		top: -0.5rem;
	}

	.site-header__bars::after {
		top: 0.5rem;
	}

	/* Open state: the middle bar disappears and the outer two cross. */
	.site-header:has(.site-header__nav.is-open) .site-header__bars {
		background-color: transparent;
	}

	.site-header:has(.site-header__nav.is-open) .site-header__bars::before {
		top: 0;
		transform: rotate(-45deg);
	}

	.site-header:has(.site-header__nav.is-open) .site-header__bars::after {
		top: 0;
		transform: rotate(45deg);
	}

	.site-header__logo {
		grid-column: 2;
		justify-self: center;
		display: block;
		color: var(--ink);
	}

	.site-header__logo :global(svg) {
		width: min(13rem, 55vw);
		height: auto;
	}

	.site-header__nav {
		display: none;
		grid-column: 1 / -1;
	}

	.site-header__nav.is-open {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding-block: 2rem 1rem;
		border-top: 1px solid var(--seam);
	}

	@media (prefers-reduced-motion: no-preference) {
		.site-header__bars,
		.site-header__bars::before,
		.site-header__bars::after {
			transition:
				background-color var(--tx-duration) var(--tx-easing),
				top var(--tx-duration) var(--tx-easing),
				transform var(--tx-duration) var(--tx-easing);
		}
	}

	/* From here the nav is always visible and the toggle is unnecessary. */
	@media (min-width: 64em) {
		.site-header {
			grid-template-columns: auto 1fr auto;
			padding-block: 1.75rem;
		}

		.site-header__toggle {
			display: none;
		}

		.site-header__logo {
			grid-column: 1;
			justify-self: start;
		}

		.site-header__logo :global(svg) {
			width: 15rem;
		}

		.site-header__nav {
			display: flex;
			grid-column: 3;
			align-items: center;
			gap: 2.5rem;
		}
	}
</style>
