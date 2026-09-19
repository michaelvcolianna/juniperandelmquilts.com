/**
 * The whole site is prerendered to static HTML. Routes that genuinely need a
 * server — /newsletter, /checkout, /preview — opt out individually.
 */
export const prerender = true;
