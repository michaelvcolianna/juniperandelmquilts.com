/**
 * The "Quilt Block" palette, as the single source of truth.
 *
 * These values are mirrored by the custom properties in `app.css`. They live
 * here as well so `palette.spec.ts` can assert the contrast ratios every build —
 * the old site shipped a link colour at roughly 1.2:1 against its own page
 * background for three years without anyone noticing, and a test is the only
 * thing that reliably stops that recurring.
 */
export const palette = {
	ink: '#1C1A17',
	paper: '#FAF7F2',
	seam: '#CEC5B6',
	accent: '#A8422E',
	muted: '#6B6459'
} as const;

export type PaletteName = keyof typeof palette;

/** sRGB channel to linear-light, per WCAG 2.x relative luminance. */
function channelToLinear(value: number): number {
	const srgb = value / 255;
	return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
	const normalized = hex.replace('#', '');

	if (!/^[0-9a-f]{6}$/i.test(normalized)) {
		throw new Error(`Expected a 6-digit hex colour, got "${hex}"`);
	}

	const [r, g, b] = [0, 2, 4].map((offset) =>
		channelToLinear(parseInt(normalized.slice(offset, offset + 2), 16))
	);

	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two colours, from 1 to 21. */
export function contrastRatio(foreground: string, background: string): number {
	const a = relativeLuminance(foreground);
	const b = relativeLuminance(background);
	const [lighter, darker] = a > b ? [a, b] : [b, a];

	return (lighter + 0.05) / (darker + 0.05);
}
