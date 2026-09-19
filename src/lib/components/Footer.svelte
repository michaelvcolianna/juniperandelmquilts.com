<script lang="ts">
	import ExternalLink from './ExternalLink.svelte';
	import Navigation from './Navigation.svelte';
	import SocialMedia from './SocialMedia.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="site-footer">
	<div class="site-footer__general">
		<h2>Juniper &amp; Elm Quilts</h2>

		<p>
			Powered by <ExternalLink href="https://www.storyblok.com/">Storyblok</ExternalLink>
			and <ExternalLink href="https://svelte.dev/">SvelteKit</ExternalLink>.
		</p>

		<SocialMedia />
	</div>

	<div class="site-footer__navigation">
		<Navigation inFooter />
	</div>

	<div class="site-footer__copyright accent">
		&copy; 2019&ndash;{year}. All rights reserved. Site by
		<ExternalLink href="https://github.com/michaelvcolianna">MVC</ExternalLink>.
	</div>
</footer>
