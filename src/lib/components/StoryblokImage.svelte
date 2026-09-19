<script lang="ts">
	import { imageUrl, srcset, intrinsicSize, DEFAULT_WIDTHS } from '$lib/image';
	import type { StoryblokAsset } from '$lib/storyblok/types';

	interface Props {
		image: StoryblokAsset | undefined | null;
		/**
		 * Decorative images get `alt=""` so screen readers skip them. The Nuxt
		 * build used the same flag for the Mantel, AccentImage and Newsletter
		 * backgrounds, which are pure atmosphere.
		 */
		decorative?: boolean;
		sizes?: string;
		/** Width / height. Constrains the crop across every srcset candidate. */
		aspectRatio?: number;
		widths?: number[];
		loading?: 'eager' | 'lazy';
		fetchpriority?: 'high' | 'low' | 'auto';
		class?: string;
	}

	let {
		image,
		decorative = false,
		sizes = '100vw',
		aspectRatio,
		widths = DEFAULT_WIDTHS,
		loading = 'lazy',
		fetchpriority = 'auto',
		class: className = ''
	}: Props = $props();

	const intrinsic = $derived(intrinsicSize(image?.filename));

	// Fall back to the source ratio so width/height are always present and the
	// browser can reserve space before the image loads (avoids layout shift).
	const ratio = $derived(
		aspectRatio ?? (intrinsic ? intrinsic.width / intrinsic.height : undefined)
	);

	const displayWidth = $derived(intrinsic?.width ?? 1200);
	const displayHeight = $derived(ratio ? Math.round(displayWidth / ratio) : intrinsic?.height);

	const src = $derived(
		imageUrl(image?.filename, {
			width: displayWidth,
			height: ratio ? Math.round(displayWidth / ratio) : 0
		})
	);

	const candidates = $derived(srcset(image?.filename, { widths, aspectRatio: ratio }));
</script>

{#if image?.filename}
	<img
		{src}
		srcset={candidates || undefined}
		{sizes}
		alt={decorative ? '' : (image.alt ?? '')}
		width={displayWidth}
		height={displayHeight}
		{loading}
		{fetchpriority}
		decoding="async"
		class={className}
	/>
{/if}
