/**
 * Shapes for the Storyblok space (id 159199). These mirror the fields the Nuxt
 * components actually read — they are deliberately not exhaustive.
 */

export interface StoryblokAsset {
	filename: string;
	alt?: string | null;
	title?: string | null;
	focus?: string | null;
}

/** Storyblok's richtext document node. */
export interface RichTextNode {
	type: string;
	content?: RichTextNode[];
	attrs?: Record<string, unknown>;
	marks?: unknown[];
	text?: string;
}

export interface RichTextDocument {
	type: 'doc';
	content?: RichTextNode[];
}

export interface Blok {
	_uid: string;
	component: string;
	[key: string]: unknown;
}

export interface MantelBlok extends Blok {
	component: 'mantel';
	image: StoryblokAsset;
	headline: string;
	copy?: string;
}

export interface ContentBlok extends Blok {
	component: 'content';
	body: Blok[];
}

export interface FeaturedItemsBlok extends Blok {
	component: 'featured-items';
	headline: string;
	copy?: RichTextDocument;
	/** Resolved story relations, via `resolve_relations`. */
	items?: StoryblokStory[];
	images?: StoryblokAsset[];
}

export interface AccentImageBlok extends Blok {
	component: 'accent-image';
	image: StoryblokAsset;
}

export interface AlignedImageBlok extends Blok {
	component: 'aligned-image';
	title?: string;
	alignment: 'left' | 'right';
	image: StoryblokAsset;
	content?: RichTextDocument;
}

export interface ImageGalleryBlok extends Blok {
	component: 'image-gallery';
	images: StoryblokAsset[];
}

export interface CtaBlok extends Blok {
	component: 'cta';
	headline: string;
	copy?: string;
}

export interface NewsletterSignupBlok extends Blok {
	component: 'newsletter-signup';
	image: StoryblokAsset;
	headline: string;
	copy?: string;
}

export interface BlogPostBlok extends Blok {
	component: 'blog-post';
	body?: RichTextDocument;
	excerpt?: string;
	/** A Storyblok single-option field — the string 'yes', not a boolean. */
	show_hero?: string;
	hero?: StoryblokAsset;
}

/** Fields present on every story's `content`, regardless of type. */
export interface StoryContent {
	_uid: string;
	component: string;
	body?: Blok[];
	/** Fallback social card image. */
	card?: StoryblokAsset;
	/** Fallback meta description. */
	description?: string;
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
