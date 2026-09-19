<script lang="ts">
	import { editableAttrs } from '../editable';
	import ExternalLink from '$lib/components/ExternalLink.svelte';
	import type { CtaBlok } from '../types';

	let { blok }: { blok: CtaBlok } = $props();

	const PROFILE = 'https://www.instagram.com/juniperandelmquilts';
</script>

<section {...editableAttrs(blok)} id={blok._uid} class="cta">
	<div class="cta__inner">
		<div class="cta__text">
			<h2>{blok.headline}</h2>
			{#if blok.copy}
				<p>{blok.copy}</p>
			{/if}
		</div>

		<p class="cta__action">
			<ExternalLink href={PROFILE} class="cta__link">Follow us on Instagram</ExternalLink>
		</p>
	</div>
</section>
