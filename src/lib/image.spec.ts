import { describe, it, expect } from 'vitest';
import {
	imageUrl,
	srcset,
	intrinsicSize,
	ASSET_ORIGIN,
	usableWidth,
	candidateWidths,
	MAX_WIDTH
} from './image';

const ASSET = 'https://a.storyblok.com/f/159199/1200x627/0b448f6439/card.jpg';

describe('imageUrl', () => {
	it('rewrites the Storyblok origin to the branded CDN', () => {
		expect(imageUrl(ASSET, { width: 800 }).startsWith(ASSET_ORIGIN)).toBe(true);
	});

	it('emits a Storyblok /m/ transform with a webp filter by default', () => {
		expect(imageUrl(ASSET, { width: 800 })).toBe(
			`${ASSET_ORIGIN}/f/159199/1200x627/0b448f6439/card.jpg/m/800x0/filters:format(webp)`
		);
	});

	it('includes height when given, for a fixed crop', () => {
		expect(imageUrl(ASSET, { width: 800, height: 450 })).toContain('/m/800x450/');
	});

	it('appends quality and focal filters when supplied', () => {
		const url = imageUrl(ASSET, { width: 400, quality: 70, focus: '480x300:481x301' });
		expect(url).toContain('filters:format(webp):quality(70):focal(480x300:481x301)');
	});

	it('rounds fractional widths', () => {
		expect(imageUrl(ASSET, { width: 799.6 })).toContain('/m/800x0/');
	});

	it('returns an empty string for a missing filename', () => {
		expect(imageUrl(undefined, { width: 800 })).toBe('');
		expect(imageUrl(null, { width: 800 })).toBe('');
		expect(imageUrl('', { width: 800 })).toBe('');
	});

	it('passes SVGs through to the CDN without a transform', () => {
		const svg = 'https://a.storyblok.com/f/159199/logo.svg';
		expect(imageUrl(svg, { width: 800 })).toBe(`${ASSET_ORIGIN}/f/159199/logo.svg`);
	});
});

describe('srcset', () => {
	it('emits one candidate per width with a w descriptor', () => {
		const result = srcset(ASSET, { widths: [320, 640] });
		expect(result).toBe(
			`${ASSET_ORIGIN}/f/159199/1200x627/0b448f6439/card.jpg/m/320x0/filters:format(webp) 320w, ` +
				`${ASSET_ORIGIN}/f/159199/1200x627/0b448f6439/card.jpg/m/640x0/filters:format(webp) 640w`
		);
	});

	it('derives heights from an aspect ratio so every candidate crops alike', () => {
		const result = srcset(ASSET, { widths: [320, 640], aspectRatio: 16 / 9 });
		expect(result).toContain('/m/320x180/');
		expect(result).toContain('/m/640x360/');
	});

	it('returns an empty string when there is nothing to transform', () => {
		expect(srcset(undefined)).toBe('');
		expect(srcset('https://a.storyblok.com/f/159199/logo.svg')).toBe('');
	});
});

describe('intrinsicSize', () => {
	it('reads the source dimensions Storyblok encodes in the path', () => {
		expect(intrinsicSize(ASSET)).toEqual({ width: 1200, height: 627 });
	});

	it('returns null when the path carries no dimensions', () => {
		expect(intrinsicSize('https://a.storyblok.com/f/159199/logo.svg')).toBeNull();
		expect(intrinsicSize(undefined)).toBeNull();
	});
});

describe('usableWidth', () => {
	// 2500x2449 — the real "parade-01.jpg" that was being upscaled to 2500x3125.
	const SQUARISH = 'https://a.storyblok.com/f/159199/2500x2449/2d7378c416/parade-01.jpg';
	const SMALL = 'https://a.storyblok.com/f/159199/1368x912/684fdda156/release-quilt.jpg';

	it('caps at MAX_WIDTH so we never request a 2500px transform', () => {
		expect(usableWidth(SQUARISH, 2500)).toBe(MAX_WIDTH);
	});

	it('never exceeds the source width', () => {
		expect(usableWidth(SMALL, 1600)).toBe(1368);
	});

	it('shrinks further when a crop ratio would need pixels the source lacks', () => {
		// A 4:5 portrait crop of a 2500x2449 source can only be 2449 * 0.8 wide.
		expect(usableWidth(SQUARISH, 1600, 4 / 5)).toBe(1600);
		expect(usableWidth(SQUARISH, 2500, 4 / 5)).toBe(1600);
		// With the cap lifted, the ratio is what binds.
		expect(usableWidth(SMALL, 1600, 4 / 5)).toBe(730);
	});

	it('falls back to the requested width when dimensions are unknown', () => {
		expect(usableWidth('https://a.storyblok.com/f/159199/logo.svg', 900)).toBe(900);
	});
});

describe('candidateWidths', () => {
	const ASSET_2500 = 'https://a.storyblok.com/f/159199/2500x1667/12b551cefe/mantel.jpeg';

	it('never emits a candidate above the usable maximum', () => {
		const widths = candidateWidths(ASSET_2500);
		expect(Math.max(...widths)).toBeLessThanOrEqual(MAX_WIDTH);
	});

	it('always includes the maximum so large viewports stay sharp', () => {
		expect(candidateWidths(ASSET_2500)).toContain(MAX_WIDTH);
	});

	it('is sorted and free of duplicates', () => {
		const widths = candidateWidths(ASSET_2500);
		expect(widths).toEqual([...new Set(widths)].sort((a, b) => a - b));
	});

	it('drops candidates a small source cannot satisfy', () => {
		const widths = candidateWidths(
			'https://a.storyblok.com/f/159199/1368x912/684fdda156/release-quilt.jpg'
		);
		expect(Math.max(...widths)).toBe(1368);
		expect(widths.every((w) => w <= 1368)).toBe(true);
	});
});
