import { describe, it, expect } from 'vitest';
import { splitRichText } from './richtext';
import type { RichTextDocument } from './types';

const paragraph = (text: string) => ({
	type: 'paragraph',
	content: [{ type: 'text', text }]
});

const blokNode = (component: string, uid = 'abc') => ({
	type: 'blok',
	attrs: { body: [{ _uid: uid, component }] }
});

describe('splitRichText', () => {
	it('returns nothing for empty or missing content', () => {
		expect(splitRichText(undefined)).toEqual([]);
		expect(splitRichText(null)).toEqual([]);
		expect(splitRichText({ type: 'doc', content: [] })).toEqual([]);
	});

	it('renders prose nodes to html', () => {
		const doc = { type: 'doc', content: [paragraph('Hello')] } as RichTextDocument;
		const parts = splitRichText(doc);

		expect(parts).toHaveLength(1);
		expect(parts[0].kind).toBe('html');
		expect(parts[0].kind === 'html' && parts[0].html).toContain('Hello');
	});

	it('extracts embedded bloks as components, not html', () => {
		const doc = { type: 'doc', content: [blokNode('cta')] } as unknown as RichTextDocument;
		const parts = splitRichText(doc);

		expect(parts).toHaveLength(1);
		expect(parts[0].kind).toBe('blok');
		expect(parts[0].kind === 'blok' && parts[0].blok.component).toBe('cta');
	});

	it('preserves document order when prose and bloks are interleaved', () => {
		const doc = {
			type: 'doc',
			content: [paragraph('before'), blokNode('cta'), paragraph('after')]
		} as unknown as RichTextDocument;

		expect(splitRichText(doc).map((p) => p.kind)).toEqual(['html', 'blok', 'html']);
	});

	it('renders each prose node as its own fragment, matching the old markup', () => {
		const doc = {
			type: 'doc',
			content: [paragraph('one'), paragraph('two')]
		} as RichTextDocument;

		const parts = splitRichText(doc);
		expect(parts).toHaveLength(2);
		expect(parts[0].kind === 'html' && parts[0].html).not.toContain('two');
	});

	it('drops a blok node that has no component selected', () => {
		const doc = {
			type: 'doc',
			content: [{ type: 'blok', attrs: { body: [] } }]
		} as unknown as RichTextDocument;

		expect(splitRichText(doc)).toEqual([]);
	});

	it('gives every part a distinct key', () => {
		const doc = {
			type: 'doc',
			content: [paragraph('a'), blokNode('cta'), paragraph('b')]
		} as unknown as RichTextDocument;

		const keys = splitRichText(doc).map((p) => p.key);
		expect(new Set(keys).size).toBe(keys.length);
	});
});
