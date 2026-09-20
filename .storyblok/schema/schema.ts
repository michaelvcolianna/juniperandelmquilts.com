import { defineSchema } from '@storyblok/schema';
import type { Schema as InferSchema, Story as InferStory } from '@storyblok/schema';
import type { BlockContent, MapiStory as InferStoryMapi } from '@storyblok/schema';

import { accentImageBlock } from './blocks/blocks/accent-image';
import { alignedImageBlock } from './blocks/blocks/aligned-image';
import { blogPostBlock } from './blocks/content/blog-post';
import { contentBlock } from './blocks/content';
import { ctaBlock } from './blocks/blocks/cta';
import { featuredItemsBlock } from './blocks/blocks/featured-items';
import { imageGalleryBlock } from './blocks/blocks/image-gallery';
import { mantelBlock } from './blocks/blocks/mantel';
import { newsletterSignupBlock } from './blocks/blocks/newsletter-signup';
import { blocksFolder, contentFolder, productsFolder } from './folders';

export const schema = defineSchema({
  blocks: {
    accentImageBlock,
    alignedImageBlock,
    blogPostBlock,
    contentBlock,
    ctaBlock,
    featuredItemsBlock,
    imageGalleryBlock,
    mantelBlock,
    newsletterSignupBlock,
  },
  folders: {
    blocksFolder,
    contentFolder,
    productsFolder,
  },
});

export type Schema = InferSchema<typeof schema>;
export type Blocks = Schema['blocks'];
export type FieldPlugins = Schema['fieldPlugins'];
export type Story = InferStory<Blocks, FieldPlugins>;
export type StoryMapi = InferStoryMapi<Blocks, FieldPlugins>;

// Type a component's props by block name: `Block<"hero">`.
export type Block<TName extends Blocks['name']> = BlockContent<
  Extract<Blocks, { name: TName }>,
  Blocks,
  FieldPlugins
>;

// Loose union of every block's content, for a dynamic component dispatcher.
export type AnyBlock = BlockContent<Blocks, Blocks, FieldPlugins>;
