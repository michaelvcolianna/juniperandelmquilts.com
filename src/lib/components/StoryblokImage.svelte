<script lang="ts">
	import {
		imageUrl,
		intrinsicSize,
		candidateWidths,
		usableWidth,
		FALLBACK_WIDTH
	} from '$lib/image';
	import type { StoryblokAsset } from '$lib/storyblok/types';

	interface Props {
		image: StoryblokAsset | undefined | null;
		/**
		 * Decorative images get `alt=""` so screen readers skip them.
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
		widths,
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

	/*
	 * The `src` is a mid-sized fallback, not the full-resolution original. Using
	 * the intrinsic width here meant requesting 2500px transforms and shipping
	 * 1.5 MB per image; the browser picks a real candidate from srcset anyway.
	 */
	const srcWidth = $derived(usableWidth(image?.filename, FALLBACK_WIDTH, aspectRatio));

	const src = $derived(
		imageUrl(image?.filename, {
			width: srcWidth,
			height: ratio ? Math.round(srcWidth / ratio) : 0
		})
	);

	const candidates = $derived(
		candidateWidths(image?.filename, aspectRatio, widths)
			.map((width) => {
				const height = ratio ? Math.round(width / ratio) : 0;
				return `${imageUrl(image?.filename, { width, height })} ${width}w`;
			})
			.join(', ')
	);

	// Presentational dimensions: only the ratio matters, so express it at the
	// fallback width rather than the source's pixel count.
	const displayWidth = $derived(srcWidth);
	const displayHeight = $derived(
		ratio ? Math.round(srcWidth / ratio) : (intrinsic?.height ?? undefined)
	);
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
