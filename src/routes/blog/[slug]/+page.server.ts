import { error } from '@sveltejs/kit';
import { getStory } from '$lib/storyblok/client';
import { getAllBlogSlugs } from '$lib/blog';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const story = await getStory(`blog/${params.slug}`);
		return { story };
	} catch {
		throw error(404, 'That post could not be found.');
	}
};

export const entries: EntryGenerator = async () => {
	const slugs = await getAllBlogSlugs();
	return slugs.map((slug) => ({ slug }));
};
