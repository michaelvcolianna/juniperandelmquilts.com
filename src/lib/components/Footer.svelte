<script lang="ts">
	import ExternalLink from './ExternalLink.svelte';
	import Navigation from './Navigation.svelte';
	import SocialMedia from './SocialMedia.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="site-footer block--ink">
	<div class="container site-footer__inner">
		<div class="site-footer__general">
			<h2>Juniper &amp; Elm Quilts</h2>

			<p class="site-footer__blurb">Creating artwork you can curl up into.</p>

			<SocialMedia />
		</div>

		<div class="site-footer__navigation">
			<Navigation inFooter />
		</div>

		<p class="site-footer__copyright accent">
			&copy; 2019&ndash;{year}. All rights reserved. Site by
			<ExternalLink href="https://github.com/michaelvcolianna">MVC</ExternalLink>.
		</p>
	</div>
</footer>

<style>
	.site-footer {
		padding-block: var(--block-space);
	}

	.site-footer__inner {
		display: grid;
		gap: 2.5rem;
	}

	.site-footer__general h2 {
		font-size: var(--text-h4);
		margin-block-end: 0.5rem;
	}

	.site-footer__blurb {
		color: var(--seam);
		margin-block-end: 1rem;
	}

	.site-footer__copyright {
		padding-block-start: 2rem;
		border-top: 1px solid rgb(255 255 255 / 0.15);
	}

	@media (min-width: 48em) {
		.site-footer__inner {
			grid-template-columns: 2fr 1fr;
			column-gap: var(--gutter);
		}

		.site-footer__copyright {
			grid-column: 1 / -1;
		}
	}
</style>
