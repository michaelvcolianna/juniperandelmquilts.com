import { format, parseISO } from 'date-fns';
import { resolve } from '$app/paths';
import { BLOG_FOLDER } from './site';
import type { StoryContent, StoryblokAsset, BlogPostBlok } from './storyblok/types';

/**
 * Pick the best available image for a story: the hero from its first block,
 * falling back to the story's card image.
 *
 * The Nuxt `bestImage` composable read `body[0].hero.filename` directly, which
 * threw whenever the first block had no `hero` field at all. Guarded here.
 */
export function bestImage(content: StoryContent | undefined | null): StoryblokAsset | undefined {
	if (!content) return undefined;

	const first = content.body?.[0] as BlogPostBlok | undefined;
	// Optional asset fields arrive as `null`, not `undefined`, from the CDA.
	return (first?.hero?.filename ? first.hero : content.card) ?? undefined;
}

/** The story's own excerpt, if its first block carries one. */
export function excerpt(content: StoryContent | undefined | null): string | undefined {
	const first = content?.body?.[0] as BlogPostBlok | undefined;
	return first?.excerpt || content?.description || undefined;
}

/** Storyblok's single-option fields are strings, so `show_hero` is 'yes', not true. */
export function showsHero(content: StoryContent | undefined | null): boolean {
	const first = content?.body?.[0] as BlogPostBlok | undefined;
	return first?.show_hero === 'yes';
}

/** Matches the Nuxt `storyDate` composable's default format. */
export function storyDate(date: string | null | undefined, pattern = 'MMM do, yyyy'): string {
	if (!date) return '';

	try {
		return format(parseISO(date), pattern);
	} catch {
		return '';
	}
}

/**
 * A link to a story.
 *
 * Featured items are arbitrary story relations chosen in the CMS, so the target
 * route is not known statically. Blog posts — the only foldered type today —
 * resolve against the typed route; anything else falls back to its full_slug.
 */
export function storyHref(story: { slug: string; full_slug: string }): string {
	if (story.full_slug.startsWith(`${BLOG_FOLDER}`)) {
		return resolve('/blog/[slug]', { slug: story.slug });
	}

	return `/${story.full_slug.replace(/^\/+/, '')}`;
}
