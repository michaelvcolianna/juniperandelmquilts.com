import { error } from '@sveltejs/kit';
import { getStory } from '$lib/storyblok/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const story = await getStory('home');
		return { story };
	} catch {
		// A prerendered build should fail loudly rather than emit a broken page.
		throw error(404, 'The home page could not be loaded from Storyblok.');
	}
};
