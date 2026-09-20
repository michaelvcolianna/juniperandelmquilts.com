import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { palette, contrastRatio, relativeLuminance } from './palette';

// WCAG 2.2 thresholds.
const AA_BODY = 4.5; // 1.4.3, normal-size text
const AA_LARGE = 3; // 1.4.3, >=24px or >=18.66px bold
const AA_NON_TEXT = 3; // 1.4.11, UI components and graphical objects

describe('contrastRatio', () => {
	it('is 21:1 for black on white', () => {
		expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
	});

	it('is 1:1 for a colour against itself', () => {
		expect(contrastRatio('#A8422E', '#A8422E')).toBeCloseTo(1, 5);
	});

	it('is symmetrical', () => {
		expect(contrastRatio('#1C1A17', '#FAF7F2')).toBeCloseTo(
			contrastRatio('#FAF7F2', '#1C1A17'),
			10
		);
	});

	it('rejects malformed input rather than silently scoring it', () => {
		expect(() => relativeLuminance('nope')).toThrow();
		expect(() => relativeLuminance('#FFF')).toThrow();
	});

	it('scores the old site’s link colour as the failure it was', () => {
		// --color-green on --color-grey-dark, shipped for three years.
		expect(contrastRatio('#1a5123', '#38383b')).toBeLessThan(2);
	});
});

describe('Quilt Block palette meets WCAG 2.2 AA', () => {
	it('body text on paper', () => {
		expect(contrastRatio(palette.ink, palette.paper)).toBeGreaterThanOrEqual(AA_BODY);
	});

	it('links and accent text on paper', () => {
		expect(contrastRatio(palette.accent, palette.paper)).toBeGreaterThanOrEqual(AA_BODY);
	});

	it('muted captions and metadata on paper', () => {
		expect(contrastRatio(palette.muted, palette.paper)).toBeGreaterThanOrEqual(AA_BODY);
	});

	it('paper text on an accent button', () => {
		expect(contrastRatio(palette.paper, palette.accent)).toBeGreaterThanOrEqual(AA_BODY);
	});

	it('paper text on ink, for the inverted footer and menu', () => {
		expect(contrastRatio(palette.paper, palette.ink)).toBeGreaterThanOrEqual(AA_BODY);
	});

	it('inverted metadata uses seam, not muted', () => {
		// muted-on-ink is only 2.97:1, which is why .block--ink overrides .accent
		// to use seam instead. Both halves of that are asserted here so removing
		// the override breaks a test rather than shipping unreadable text.
		expect(contrastRatio(palette.muted, palette.ink)).toBeLessThan(AA_LARGE);
		expect(contrastRatio(palette.seam, palette.ink)).toBeGreaterThanOrEqual(AA_BODY);
	});

	it('seam rules read as hairlines without becoming heavy', () => {
		// Seams are decorative separators, so 1.4.11's 3:1 does not apply. They do
		// carry the design's organising idea, so they must not be invisible.
		const ratio = contrastRatio(palette.seam, palette.paper);
		expect(ratio).toBeGreaterThan(1.5);
		expect(ratio).toBeLessThan(2.5);
	});

	it('the focus ring is visible against every surface it lands on', () => {
		// On paper the ring is accent; on ink it switches to paper, because
		// accent-on-ink is only 2.88:1 and would fail 1.4.11.
		expect(contrastRatio(palette.accent, palette.paper)).toBeGreaterThanOrEqual(AA_NON_TEXT);
		expect(contrastRatio(palette.accent, palette.ink)).toBeLessThan(AA_NON_TEXT);
		expect(contrastRatio(palette.paper, palette.ink)).toBeGreaterThanOrEqual(AA_NON_TEXT);
	});
});

describe('app.css matches the palette module', () => {
	const css = readFileSync(new URL('../app.css', import.meta.url), 'utf8');

	it.each(Object.entries(palette))('--%s is defined as %s', (name, value) => {
		const declaration = new RegExp(`--${name}:\\s*${value};`, 'i');
		expect(css).toMatch(declaration);
	});
});

describe('app.css carries the overrides the palette requires', () => {
	const css = readFileSync(new URL('../app.css', import.meta.url), 'utf8');

	it('inverted blocks recolour muted metadata to seam', () => {
		expect(css).toMatch(/\.block--ink \.accent \{\s*color: var\(--seam\);/);
	});

	it('inverted blocks recolour the focus ring to paper', () => {
		expect(css).toMatch(/\.block--ink :focus-visible \{\s*outline-color: var\(--paper\);/);
	});
});
