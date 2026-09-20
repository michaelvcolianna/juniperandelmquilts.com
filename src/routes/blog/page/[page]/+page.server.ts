import { error } from '@sveltejs/kit';
import { getBlogPage, getBlogPageCount } from '$lib/blog';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const page = Number(params.page);

	// Page 1 lives at /blog, so this route starts at 2 — two URLs for the same
	// content would be a duplicate-content problem.
	if (!Number.isInteger(page) || page < 2) {
		throw error(404, 'No such blog page.');
	}

	const listing = await getBlogPage(page);

	if (page > listing.totalPages) {
		throw error(404, 'No such blog page.');
	}

	return { listing };
};

/** Tell the prerenderer which listing pages exist. */
export const entries: EntryGenerator = async () => {
	const totalPages = await getBlogPageCount();

	return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
		page: String(index + 2)
	}));
};
