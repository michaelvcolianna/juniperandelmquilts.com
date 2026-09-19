import type { Component } from 'svelte';
import AccentImage from './blocks/AccentImage.svelte';
import AlignedImage from './blocks/AlignedImage.svelte';
import BlogPost from './blocks/BlogPost.svelte';
import Content from './blocks/Content.svelte';
import Cta from './blocks/Cta.svelte';
import FeaturedItems from './blocks/FeaturedItems.svelte';
import ImageGallery from './blocks/ImageGallery.svelte';
import Mantel from './blocks/Mantel.svelte';
import NewsletterSignup from './blocks/NewsletterSignup.svelte';

/**
 * Maps Storyblok component names to Svelte components. The Nuxt build got this
 * for free from `@storyblok/nuxt`'s directory-based auto-registration; here it
 * is explicit, which also means an unknown component fails visibly rather than
 * rendering nothing.
 *
 * Note `Content` and `AlignedImage` render `RichText`, which reads this map —
 * a module cycle. `getBlockComponent` is a function so the lookup happens at
 * render time, by which point every binding is populated.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry: Record<string, Component<any>> = {
	'accent-image': AccentImage,
	'aligned-image': AlignedImage,
	'blog-post': BlogPost,
	content: Content,
	cta: Cta,
	'featured-items': FeaturedItems,
	'image-gallery': ImageGallery,
	mantel: Mantel,
	'newsletter-signup': NewsletterSignup
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getBlockComponent(name: string): Component<any> | undefined {
	return registry[name];
}

export function knownBlockNames(): string[] {
	return Object.keys(registry);
}
