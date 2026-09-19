import type { Blok } from './types';

/**
 * Attributes that let the Storyblok Visual Editor map a rendered element back to
 * the block that produced it, so editors can click an element on the page and
 * land on the right field.
 *
 * This reimplements `storyblokEditable` from `@storyblok/js` — it is a dozen
 * lines with no dependencies, and inlining it keeps that SDK out of the public
 * client bundle entirely. The SDK stays confined to /preview, where the bridge
 * genuinely needs it.
 *
 * Storyblok only sends `_editable` on draft content, so on the published site
 * this returns `{}` and no attributes are emitted. There is no flag to set and
 * nothing leaks into production HTML.
 */
export function editableAttrs(blok: Blok | undefined | null): Record<string, string> {
	const marker = (blok as { _editable?: unknown } | undefined)?._editable;

	if (typeof marker !== 'string') return {};

	try {
		// The marker is an HTML comment wrapping a JSON payload:
		// <!--#storyblok#{"name":"mantel","space":"159199","uid":"...","id":"..."}-->
		const options = JSON.parse(marker.replace(/^<!--#storyblok#/, '').replace(/-->$/, ''));

		if (!options) return {};

		return {
			'data-blok-c': JSON.stringify(options),
			'data-blok-uid': `${options.id}-${options.uid}`
		};
	} catch {
		// A malformed marker should never break rendering.
		return {};
	}
}
