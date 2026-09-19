import { renderRichText } from '@storyblok/richtext';
import type { RichTextDocument, RichTextNode, Blok } from './types';

/**
 * Storyblok richtext can contain embedded component ("blok") nodes alongside
 * ordinary prose. The Nuxt `RichText.vue` walked the top-level node list and
 * split it: `type === 'blok'` nodes became live Vue components, everything else
 * was rendered to an HTML string one node at a time.
 *
 * This reproduces that split so the Svelte component can stay declarative. It is
 * deliberately faithful to the original, including rendering each prose node as
 * its own fragment rather than grouping consecutive runs — grouping would change
 * the emitted markup and the CSS that targets it.
 */

export type RichTextPart =
	{ kind: 'blok'; key: number; blok: Blok } | { kind: 'html'; key: number; html: string };

export function splitRichText(content: RichTextDocument | undefined | null): RichTextPart[] {
	const nodes = content?.content;
	if (!nodes?.length) return [];

	return nodes.flatMap((node: RichTextNode, index: number): RichTextPart[] => {
		if (node.type === 'blok') {
			// The editor nests the chosen component under attrs.body; the original
			// took only the first entry.
			const body = (node.attrs as { body?: Blok[] } | undefined)?.body;
			const blok = body?.[0];

			// An empty embed is possible if an editor adds the node but no component.
			return blok ? [{ kind: 'blok', key: index, blok }] : [];
		}

		return [
			{
				kind: 'html',
				key: index,
				html: renderRichText({ type: 'doc', content: [node] } as never)
			}
		];
	});
}
