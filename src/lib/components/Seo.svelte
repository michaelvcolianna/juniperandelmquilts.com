<script lang="ts">
	import { page } from '$app/state';
	import { imageUrl } from '$lib/image';
	import { SITE_NAME, SITE_DESCRIPTION, SITE_IMAGE, absoluteUrl } from '$lib/site';
	import type { StoryblokAsset } from '$lib/storyblok/types';

	interface Props {
		/** Page title, without the site-name suffix. Omit on the home page. */
		title?: string;
		/** Optional CMS fields arrive as `null` rather than `undefined`. */
		description?: string | null;
		image?: StoryblokAsset | string | null;
		type?: 'website' | 'article';
		publishedAt?: string | null;
	}

	let { title, description, image, type = 'website', publishedAt }: Props = $props();

	const fullTitle = $derived(title ? `${title} | ${SITE_NAME}` : SITE_NAME);
	const metaDescription = $derived(description || SITE_DESCRIPTION);
	const canonical = $derived(absoluteUrl(page.url.pathname));

	const socialImage = $derived.by(() => {
		if (!image) return SITE_IMAGE;
		if (typeof image === 'string') return image;
		// Social crawlers want a concrete, reasonably sized raster.
		return image.filename
			? imageUrl(image.filename, { width: 1200, height: 630, format: 'jpeg' })
			: SITE_IMAGE;
	});
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href={canonical} />

	<!-- Carried over from the Nuxt build, alongside static/robots.txt. -->
	<meta name="robots" content="noai, noimageai" />

	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:image" content={socialImage} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonical} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={socialImage} />

	{#if publishedAt}
		<meta property="article:published_time" content={publishedAt} />
	{/if}
</svelte:head>
