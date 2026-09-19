import type { BlockContent, AssetFieldValue, RichTextFieldValue } from '@storyblok/schema';
import type {
	AnyBlock,
	accentImageBlock,
	alignedImageBlock,
	blogPostBlock,
	contentBlock,
	ctaBlock,
	featuredItemsBlock,
	imageGalleryBlock,
	mantelBlock,
	newsletterSignupBlock
} from './schema';

/**
 * Content shapes for space 159199, derived from `schema.ts` rather than written
 * by hand. Renaming a field in the schema now breaks the components that read
 * it, instead of the two drifting silently.
 */

export type StoryblokAsset = AssetFieldValue;
export type RichTextDocument = RichTextFieldValue;

/**
 * A block instance of unknown type, as delivered by the CDA.
 *
 * Deliberately structural rather than the generated union: `Blok.svelte` and
 * `RichText.svelte` dispatch on `component` at runtime over genuinely
 * heterogeneous data, and every root story content object flows through here
 * too. The generated per-block types above are where the schema earns its keep.
 */
export interface Blok {
	_uid: string;
	component: string;
	_editable?: string;
	[key: string]: unknown;
}

export type MantelBlok = BlockContent<typeof mantelBlock, AnyBlock>;
export type AccentImageBlok = BlockContent<typeof accentImageBlock, AnyBlock>;
export type AlignedImageBlok = BlockContent<typeof alignedImageBlock, AnyBlock>;
export type ImageGalleryBlok = BlockContent<typeof imageGalleryBlock, AnyBlock>;
export type CtaBlok = BlockContent<typeof ctaBlock, AnyBlock>;
export type NewsletterSignupBlok = BlockContent<typeof newsletterSignupBlock, AnyBlock>;
export type BlogPostBlok = BlockContent<typeof blogPostBlock, AnyBlock>;
export type ContentBlok = BlockContent<typeof contentBlock, AnyBlock>;

/**
 * `items` is an `options` field, so the schema types it as an array of story
 * UUIDs — which is what the API returns *unresolved*. Every read of this block
 * goes through `resolve_relations: ['featured-items.items']`, which replaces
 * those UUIDs with whole story objects, so the delivered shape is overridden
 * here to match what the component actually receives.
 */
export type FeaturedItemsBlok = Omit<BlockContent<typeof featuredItemsBlock, AnyBlock>, 'items'> & {
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
