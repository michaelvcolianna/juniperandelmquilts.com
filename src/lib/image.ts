/**
 * Storyblok image-service URL builder.
 *
 * `@sveltejs/enhanced-img` only handles local files at build time, so it cannot
 * touch Storyblok assets. Storyblok's own image service does the resizing
 * CDN-side.
 *
 * Assets are served through the branded CloudFront distribution that fronts
 * `a.storyblok.com`, set up in commit a32be8b.
 */

const STORYBLOK_ORIGIN = 'https://a.storyblok.com';
export const ASSET_ORIGIN = 'https://assets.juniperandelmquilts.com';

/** Widths emitted in srcsets, covering 1x and 2x for the site's breakpoints. */
export const DEFAULT_WIDTHS = [320, 480, 640, 768, 960, 1280, 1600, 1920];

export interface ImageOptions {
	width: number;
	/** Omit or pass 0 to preserve the source aspect ratio. */
	height?: number;
	format?: 'webp' | 'avif' | 'jpeg' | 'png';
	/** 0-100. Storyblok's default is 80. */
	quality?: number;
	/** Storyblok focus point, e.g. "480x300:481x301". */
	focus?: string | null;
}

/**
 * Storyblok's image service only transforms raster images. SVGs are passed
 * through untouched, and a missing filename yields an empty string so callers
 * can guard on it.
 */
function isTransformable(filename: string | undefined | null): filename is string {
	if (!filename) return false;
	if (!filename.includes('/f/')) return false;
	return !filename.toLowerCase().endsWith('.svg');
}

/** Rewrite the Storyblok origin to the branded CDN. */
function toCdn(filename: string): string {
	return filename.startsWith(STORYBLOK_ORIGIN)
		? ASSET_ORIGIN + filename.slice(STORYBLOK_ORIGIN.length)
		: filename;
}

/**
 * Build a single transformed image URL.
 *
 * Storyblok's format is `<asset>/m/<w>x<h>/filters:<name>(<value>):...`
 */
export function imageUrl(filename: string | undefined | null, options: ImageOptions): string {
	if (!filename) return '';
	if (!isTransformable(filename)) return toCdn(filename);

	const { width, height = 0, format = 'webp', quality, focus } = options;

	const filters: string[] = [`format(${format})`];
	if (typeof quality === 'number') filters.push(`quality(${quality})`);
	if (focus) filters.push(`focal(${focus})`);

	return `${toCdn(filename)}/m/${Math.round(width)}x${Math.round(height)}/filters:${filters.join(':')}`;
}

/**
 * Build a `srcset`. When `aspectRatio` is given, heights are derived from it so
 * every candidate crops identically; otherwise heights are left to the source.
 */
export function srcset(
	filename: string | undefined | null,
	options: {
		widths?: number[];
		aspectRatio?: number;
		format?: ImageOptions['format'];
		quality?: number;
		focus?: string | null;
	} = {}
): string {
	if (!isTransformable(filename)) return '';

	const { widths = DEFAULT_WIDTHS, aspectRatio, format, quality, focus } = options;

	return widths
		.map((width) => {
			const height = aspectRatio ? Math.round(width / aspectRatio) : 0;
			return `${imageUrl(filename, { width, height, format, quality, focus })} ${width}w`;
		})
		.join(', ');
}

/**
 * Storyblok encodes the source dimensions in the asset path, e.g.
 * `/f/159199/1200x627/0b448f6439/card.jpg`. Reading them lets us set intrinsic
 * width/height on every `<img>` and avoid layout shift (WCAG 1.4.10 / CLS).
 */
export function intrinsicSize(
	filename: string | undefined | null
): { width: number; height: number } | null {
	if (!filename) return null;

	const match = filename.match(/\/f\/\d+\/(\d+)x(\d+)\//);
	if (!match) return null;

	return { width: Number(match[1]), height: Number(match[2]) };
}

/**
 * The largest width worth requesting. Beyond this the file size grows far
 * faster than the perceived quality on any realistic display.
 */
export const MAX_WIDTH = 1600;

/** A sensible width for the `src` fallback, when srcset is unavailable. */
export const FALLBACK_WIDTH = 1200;

/**
 * Clamp a requested width so the image service never has to invent pixels.
 *
 * Storyblok will happily serve `/m/2500x3125/` from a 2500x2449 source by
 * upscaling it, which costs bandwidth and softens the result. This caps the
 * width at MAX_WIDTH, at the source width, and — when a crop ratio is in play —
 * at whatever width keeps the derived height inside the source too.
 */
export function usableWidth(
	filename: string | undefined | null,
	requested: number,
	aspectRatio?: number
): number {
	const intrinsic = intrinsicSize(filename);
	let width = Math.min(requested, MAX_WIDTH);

	if (!intrinsic) return Math.round(width);

	width = Math.min(width, intrinsic.width);

	if (aspectRatio) {
		const height = width / aspectRatio;
		if (height > intrinsic.height) {
			width = intrinsic.height * aspectRatio;
		}
	}

	return Math.round(width);
}

/**
 * The srcset widths actually worth emitting for an image: the defaults, clamped
 * and de-duplicated, with anything above the usable maximum dropped.
 */
export function candidateWidths(
	filename: string | undefined | null,
	aspectRatio?: number,
	widths: number[] = DEFAULT_WIDTHS
): number[] {
	const max = usableWidth(filename, MAX_WIDTH, aspectRatio);
	const usable = widths.filter((width) => width < max);

	// Always include the maximum so large viewports get a sharp candidate.
	return [...new Set([...usable, max])].sort((a, b) => a - b);
}
