/** Site-wide constants. */

/**
 * The canonical origin.
 *
 * This is hardcoded rather than read from `page.url` because during prerendering
 * SvelteKit serves pages from an internal origin (`http://sveltekit-prerender`),
 * so `page.url.origin` would bake the wrong host into every canonical and
 * og:url tag. The old build had the mirror-image bug: `metaUrl()` used
 * `process.client ? window.location.origin : ''`, which emitted *relative*
 * canonicals during SSR.
 */
export const SITE_URL = 'https://www.juniperandelmquilts.com';

export const SITE_NAME = 'Juniper & Elm Quilts';

export const SITE_DESCRIPTION = 'Juniper & Elm Quilts: Creating artwork you can curl up into!';

/** Default social card. */
export const SITE_IMAGE = 'https://a.storyblok.com/f/159199/1200x627/0b448f6439/card.jpg';

export const CONTACT_EMAIL = 'info@juniperandelmquilts.com';

/**
 * Where "Shop" points until on-site Square checkout exists.
 *
 * When the Square catalog lands this becomes an internal `/shop` route: change
 * the single entry in `Navigation.svelte` from `external` to `internal` and
 * delete this constant.
 */
export const ETSY_SHOP_URL = 'https://www.etsy.com/shop/JuniperandElmQuilts';

/** Build an absolute URL for a site-relative path. */
export function absoluteUrl(pathname: string): string {
	return new URL(pathname, SITE_URL).href;
}

/** Storyblok folder holding blog posts. */
export const BLOG_FOLDER = 'blog/';

/** Posts per listing page. */
export const POSTS_PER_PAGE = 10;
