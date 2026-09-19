import { getBlogPage } from '$lib/blog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	listing: await getBlogPage(1)
});
