import { getStories } from './storyblok/client';
import type { StoryblokStory } from './storyblok/types';

import { BLOG_FOLDER, POSTS_PER_PAGE } from './site';
export { BLOG_FOLDER, POSTS_PER_PAGE };

/**
 * Storyblok's `starts_with` matches the folder's own root story as well as its
 * children, so "blog" itself comes back in the list. Left in, it renders as a
 * phantom post and generates a /blog/blog URL that 404s. `is_startpage: false`
 * filters it server-side; this is the belt-and-braces check.
 */
function isPost(story: StoryblokStory): boolean {
	return story.full_slug.startsWith(BLOG_FOLDER) && story.full_slug !== BLOG_FOLDER;
}

export interface BlogListing {
	posts: StoryblokStory[];
	page: number;
	totalPages: number;
	total: number;
}

/**
 * One page of blog posts.
 *
 * The old blog index fetched inside `onMounted`, so the listing had no
 * server-rendered content and no SEO at all. It also mixed two response shapes
 * when computing the page count, which came out `NaN`, and referenced an
 * undefined `currentPgae` in the "next" link. All three are fixed by loading on
 * the server and deriving the count in `getStories`.
 */
export async function getBlogPage(page = 1): Promise<BlogListing> {
	const { stories, total, totalPages } = await getStories({
		starts_with: BLOG_FOLDER,
		is_startpage: false,
		page,
		per_page: POSTS_PER_PAGE,
		sort_by: 'first_published_at:desc'
	});

	return { posts: stories.filter(isPost), page, totalPages, total };
}

/** Every blog slug, for prerendering the post routes. */
export async function getAllBlogSlugs(): Promise<string[]> {
	const slugs: string[] = [];
	let page = 1;

	for (;;) {
		const { stories, totalPages } = await getStories({
			starts_with: BLOG_FOLDER,
			is_startpage: false,
			page,
			per_page: 100,
			sort_by: 'first_published_at:desc'
		});

		// full_slug is "blog/my-post"; the route param is just the last segment.
		slugs.push(...stories.filter(isPost).map((story) => story.slug));

		if (page >= totalPages) break;
		page += 1;
	}

	return slugs;
}

/** Total number of listing pages, for prerendering /blog/page/N. */
export async function getBlogPageCount(): Promise<number> {
	const { totalPages } = await getStories({
		starts_with: BLOG_FOLDER,
		is_startpage: false,
		page: 1,
		per_page: POSTS_PER_PAGE
	});

	return totalPages;
}
