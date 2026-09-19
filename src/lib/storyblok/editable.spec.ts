import { describe, it, expect } from 'vitest';
import { editableAttrs } from './editable';
import type { Blok } from './types';

const payload = { name: 'mantel', space: '159199', uid: 'abc-123', id: '456' };

const withMarker = (marker: unknown): Blok =>
	({ _uid: 'x', component: 'mantel', _editable: marker }) as unknown as Blok;

describe('editableAttrs', () => {
	it('emits the editor attributes for a draft blok', () => {
		const blok = withMarker(`<!--#storyblok#${JSON.stringify(payload)}-->`);

		expect(editableAttrs(blok)).toEqual({
			'data-blok-c': JSON.stringify(payload),
			'data-blok-uid': '456-abc-123'
		});
	});

	it('emits nothing on published content, where _editable is absent', () => {
		expect(editableAttrs({ _uid: 'x', component: 'mantel' } as Blok)).toEqual({});
	});

	it('emits nothing for a missing blok', () => {
		expect(editableAttrs(undefined)).toEqual({});
		expect(editableAttrs(null)).toEqual({});
	});

	it('ignores a non-string marker', () => {
		expect(editableAttrs(withMarker(42))).toEqual({});
	});

	it('does not throw on a malformed marker', () => {
		expect(editableAttrs(withMarker('<!--#storyblok#{not json}-->'))).toEqual({});
	});

	it('handles a marker without the comment wrapper', () => {
		expect(editableAttrs(withMarker(JSON.stringify(payload)))['data-blok-uid']).toBe('456-abc-123');
	});
});
