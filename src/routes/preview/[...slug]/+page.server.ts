import { error } from '@sveltejs/kit';
import { getStory } from '$lib/storyblok/client';
import type { PageServerLoad } from './$types';

/**
 * Draft preview for the Storyblok Visual Editor.
 *
 * Point the space's preview URL at https://<host>/preview/ so editors keep the
 * live-preview workflow they had before. Never prerendered, and it reads the
 * draft version rather than published content.
 */
export const prerender = false;

export const load: PageServerLoad = async ({ params }) => {
	// An empty slug means the space's home story.
	const slug = params.slug || 'home';

	try {
		return { story: await getStory(slug, 'draft') };
	} catch {
		throw error(404, `No draft story found at "${slug}".`);
	}
};
