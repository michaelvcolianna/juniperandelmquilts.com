/**
 * Keep non-production deploys out of search results.
 *
 * Netlify already sends `X-Robots-Tag: noindex` for Deploy Previews and for
 * *superseded* branch deploys — but the most recent branch deploy is indexable,
 * which is exactly the one a staging site is. Left alone, staging URLs compete
 * with the real site and leak unpublished content into search results.
 *
 * Netlify's `[[headers]]` cannot vary by context, so this appends the rule
 * after the build instead, keyed off the CONTEXT variable Netlify sets:
 * "production" | "deploy-preview" | "branch-deploy" | "dev".
 *
 * A staging site hosted as its own Netlify site reports CONTEXT="production",
 * so set NOINDEX=true in that site's environment to force the header on.
 *
 * Deliberately never fails the build — an un-indexed page is a nuisance, a
 * failed deploy is worse.
 */
import { appendFileSync } from 'node:fs';

const HEADERS_FILE = 'build/_headers';
const context = process.env.CONTEXT;
const forced = /^(1|true|yes)$/i.test(process.env.NOINDEX ?? '');

// No CONTEXT means a local build, which is never served to crawlers.
if (!forced && !context) {
	console.log('[noindex] local build, nothing to do');
} else if (!forced && context === 'production') {
	console.log('[noindex] production deploy, staying indexable');
} else {
	try {
		appendFileSync(HEADERS_FILE, `\n/*\n  X-Robots-Tag: noindex\n`);
		console.log(`[noindex] marked noindex (${forced ? 'NOINDEX override' : context})`);
	} catch (error) {
		console.warn(`[noindex] could not write ${HEADERS_FILE}:`, error.message);
	}
}
