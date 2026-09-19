import StoryblokClient from 'storyblok-js-client';
import { STORYBLOK_PUBLIC_TOKEN, STORYBLOK_PREVIEW_TOKEN } from '$env/static/private';
import type { Story, StoryblokStory } from './types';

/**
 * Content is fetched with the framework-agnostic REST client rather than
 * `@storyblok/svelte`. The SDK's value is the Visual Editor bridge, which only
 * the /preview route needs; its cost is a Svelte-5-pinned peer dependency that
 * has shipped two majors in about a year. Keeping the public site on plain REST
 * means an SDK bump can never break the build.
 */

/** Relations the CMS expects resolved. Carried over from the Nuxt build. */
export const RESOLVE_RELATIONS = ['featured-items.items'];

const published = new StoryblokClient({ accessToken: STORYBLOK_PUBLIC_TOKEN });
const draft = new StoryblokClient({ accessToken: STORYBLOK_PREVIEW_TOKEN });

export type StoryblokVersion = 'published' | 'draft';

function clientFor(version: StoryblokVersion) {
	return version === 'draft' ? draft : published;
}

/**
 * Fetch a single story by slug. Throws if the story is missing so the caller can
 * turn it into a 404 — a prerendered build should fail loudly rather than emit
 * a broken page.
 */
export async function getStory(
	slug: string,
	version: StoryblokVersion = 'published'
): Promise<Story> {
	const { data } = await clientFor(version).get(`cdn/stories/${slug}`, {
		version,
		resolve_relations: RESOLVE_RELATIONS
	});

	return data.story as Story;
}

export interface StoryListResult {
	stories: StoryblokStory[];
	total: number;
	perPage: number;
	totalPages: number;
}

/**
 * Fetch a page of stories.
 *
 * The Nuxt version of this read `response.data.stories` for the rows but
 * `response.total` / `response.perPage` for the counts — two different shapes —
 * so the page count came out `NaN` and pagination never rendered. The client
 * returns `total` on the response and echoes `per_page` from the request, so
 * both are derived explicitly here.
 */
export async function getStories(
	params: {
		starts_with?: string;
		page?: number;
		per_page?: number;
		sort_by?: string;
		is_startpage?: boolean;
	},
	version: StoryblokVersion = 'published'
): Promise<StoryListResult> {
	const perPage = params.per_page ?? 10;

	const response = await clientFor(version).get('cdn/stories', {
		version,
		resolve_relations: RESOLVE_RELATIONS,
		...params,
		per_page: perPage
	});

	const total = Number(response.total ?? 0);

	return {
		stories: (response.data.stories ?? []) as StoryblokStory[],
		total,
		perPage,
		totalPages: Math.max(1, Math.ceil(total / perPage))
	};
}
