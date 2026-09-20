import type { AssetFieldValue, RichTextFieldValue } from '@storyblok/schema';
import type { Block } from './schema';

/**
 * Content shapes for space 159199.
 *
 * These come from the generated model in `.storyblok/schema/`, via the
 * `Block<'name'>` helper it exports, rather than being written by hand. A field
 * renamed in Storyblok and pulled down with `storyblok schema init` now breaks
 * the component that reads it, instead of the two drifting silently.
 */

export type StoryblokAsset = AssetFieldValue;
export type RichTextDocument = RichTextFieldValue;

/**
 * A block instance of unknown type, as delivered by the CDA.
 *
 * Deliberately structural rather than the generated union: `Blok.svelte` and
 * `RichText.svelte` dispatch on `component` at runtime over genuinely
 * heterogeneous data, and every root story content object flows through here
 * too. The per-block types below are where the schema earns its keep.
 */
export interface Blok {
	_uid: string;
	component: string;
	_editable?: string;
	[key: string]: unknown;
}

export type MantelBlok = Block<'mantel'>;
export type AccentImageBlok = Block<'accent-image'>;
export type AlignedImageBlok = Block<'aligned-image'>;
export type ImageGalleryBlok = Block<'image-gallery'>;
export type CtaBlok = Block<'cta'>;
export type NewsletterSignupBlok = Block<'newsletter-signup'>;
export type BlogPostBlok = Block<'blog-post'>;
export type ContentBlok = Block<'content'>;

/**
 * `items` is an `options` field, so the schema types it as an array of story
 * UUIDs — which is what the API returns *unresolved*. Every read of this block
 * goes through `resolve_relations: ['featured-items.items']`, which replaces
 * those UUIDs with whole story objects, so the delivered shape is overridden
 * here to match what the component actually receives.
 */
export type FeaturedItemsBlok = Omit<Block<'featured-items'>, 'items'> & {
	items?: StoryblokStory[] | null;
};

/** Fields present on every story's `content`, regardless of type. */
export interface StoryContent {
	_uid: string;
	component: string;
	body?: Blok[];
	/** Fallback social card image. */
	card?: StoryblokAsset | null;
	/** Fallback meta description. */
	description?: string | null;
	[key: string]: unknown;
}

export interface StoryblokStory {
	id: number;
	uuid: string;
	name: string;
	slug: string;
	full_slug: string;
	first_published_at: string | null;
	published_at: string | null;
	content: StoryContent;
}

export type Story = StoryblokStory;

/** Storyblok's richtext document node, for the splitter in `richtext.ts`. */
export interface RichTextNode {
	type: string;
	content?: RichTextNode[];
	attrs?: Record<string, unknown>;
	marks?: unknown[];
	text?: string;
}
