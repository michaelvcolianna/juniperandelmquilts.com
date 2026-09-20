/**
 * Re-exports the generated content model.
 *
 * The real definitions live in `.storyblok/schema/`, produced by
 * `storyblok schema init` from space 159199 and committed as the source of
 * truth. This file existed first as a hand-written approximation, inferred from
 * what the components read; `storyblok schema diff` showed how much that missed
 * — editor tabs, component restrictions, field descriptions, and `mantel.copy`
 * being a textarea rather than a text field.
 *
 * It survives only so the rest of `src/` has a stable import path.
 */
export { schema } from '$schema/schema';
export type { Schema, Blocks, Block, AnyBlock, Story, StoryMapi } from '$schema/schema';
