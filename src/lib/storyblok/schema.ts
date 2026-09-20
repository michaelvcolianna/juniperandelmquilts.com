import {
	defineBlock,
	defineField,
	defineSchema,
	type Schema as InferSchema
} from '@storyblok/schema';

/**
 * The Storyblok content model for space 159199, defined in code.
 *
 * Until now these components existed only as clicked-together definitions in
 * the Storyblok UI, with the frontend's assumptions about them spread across
 * nine Svelte files and a hand-maintained `types.ts`. Declaring them here makes
 * the model reviewable in pull requests, versioned with the code that renders
 * it, and — via `BlockContent<T>` in `types.ts` — the single source of the
 * TypeScript types, so a field rename cannot silently diverge from the markup.
 *
 * ---------------------------------------------------------------------------
 * IMPORTANT — this file has never been reconciled against the live space.
 *
 * It was derived from what the Svelte components actually read, which pins down
 * field *names* precisely but leaves some *types* and settings as inference
 * (noted inline below). Pushing it as-is could rewrite the real component
 * definitions and disrupt editing.
 *
 * Before the first `npm run schema:push`:
 *   1. `npx storyblok schema init` into a scratch directory to pull the space's
 *      real definitions.
 *   2. `npm run schema:diff` and reconcile every difference, preferring the
 *      space's version wherever this file was guessing.
 *   3. Only then push. `npm run schema:rollback` reverts using the changeset.
 * ---------------------------------------------------------------------------
 */

/** Fields shared by every story-level root block: the SEO fallbacks. */
const cardField = defineField('card', {
	type: 'asset',
	filetypes: ['images'],
	description: 'Social share image. Falls back to the site default when empty.'
});

const descriptionField = defineField('description', {
	type: 'textarea',
	description: 'Meta description. Falls back to the site default when empty.'
});

/**
 * The root block every story uses. `body` holds the page's blocks; the blog
 * stories nest a single `blog-post` here.
 */
export const contentBlock = defineBlock({
	name: 'content',
	is_root: true,
	is_nestable: false,
	fields: [defineField('body', { type: 'bloks' }), cardField, descriptionField]
});

export const mantelBlock = defineBlock({
	name: 'mantel',
	fields: [
		defineField('image', { type: 'asset', filetypes: ['images'], required: true }),
		defineField('headline', { type: 'text', required: true }),
		// Inferred: single-line vs textarea is not observable from the markup.
		defineField('copy', { type: 'text' })
	]
});

export const featuredItemsBlock = defineBlock({
	name: 'featured-items',
	fields: [
		defineField('headline', { type: 'text', required: true }),
		defineField('copy', { type: 'richtext' }),
		// Resolved via `resolve_relations: ['featured-items.items']`.
		defineField('items', {
			type: 'options',
			source: 'internal_stories',
			description: 'Stories to feature. Resolved server-side at build time.'
		}),
		defineField('images', { type: 'multiasset', filetypes: ['images'] })
	]
});

export const accentImageBlock = defineBlock({
	name: 'accent-image',
	fields: [
		defineField('image', {
			type: 'asset',
			filetypes: ['images'],
			required: true,
			description: 'Decorative band. Rendered with alt="" and aria-hidden.'
		})
	]
});

export const alignedImageBlock = defineBlock({
	name: 'aligned-image',
	fields: [
		defineField('title', { type: 'text' }),
		/*
		 * Controls whether the image sits above or below the text.
		 *
		 * The stored values are still `right` and `left` from when this block
		 * floated its image to one side. Only the labels changed, so the existing
		 * published blocks — all of them set to `right` — keep rendering exactly
		 * as before without a content migration. `right` reads as top.
		 */
		defineField('alignment', {
			type: 'option',
			options: [
				{ name: 'Image top', value: 'right' },
				{ name: 'Image bottom', value: 'left' }
			],
			default_value: 'right'
		}),
		defineField('image', { type: 'asset', filetypes: ['images'], required: true }),
		defineField('content', { type: 'richtext' })
	]
});

export const imageGalleryBlock = defineBlock({
	name: 'image-gallery',
	fields: [defineField('images', { type: 'multiasset', filetypes: ['images'], required: true })]
});

export const ctaBlock = defineBlock({
	name: 'cta',
	fields: [
		defineField('headline', { type: 'text', required: true }),
		defineField('copy', { type: 'textarea' })
	]
});

export const newsletterSignupBlock = defineBlock({
	name: 'newsletter-signup',
	fields: [
		defineField('image', { type: 'asset', filetypes: ['images'], required: true }),
		defineField('headline', { type: 'text', required: true }),
		defineField('copy', { type: 'textarea' })
	]
});

export const blogPostBlock = defineBlock({
	name: 'blog-post',
	fields: [
		defineField('body', { type: 'richtext' }),
		defineField('excerpt', {
			type: 'textarea',
			description: 'Shown on the blog listing and used as the meta description.'
		}),
		// A single-option field, which is why the markup compares to the STRING
		// 'yes' rather than a boolean.
		defineField('show_hero', {
			type: 'option',
			options: [
				{ name: 'Yes', value: 'yes' },
				{ name: 'No', value: 'no' }
			],
			default_value: 'no'
		}),
		defineField('hero', { type: 'asset', filetypes: ['images'] })
	]
});

export const schema = defineSchema({
	blocks: {
		contentBlock,
		mantelBlock,
		featuredItemsBlock,
		accentImageBlock,
		alignedImageBlock,
		imageGalleryBlock,
		ctaBlock,
		newsletterSignupBlock,
		blogPostBlock
	}
});

export type Schema = InferSchema<typeof schema>;

/** Union of every block definition, for resolving nested `bloks` fields. */
export type AnyBlock = Schema['blocks'];

export default schema;
