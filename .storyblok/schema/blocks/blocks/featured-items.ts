import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { blocksFolder } from '../../folders';

export const featuredItemsBlock = defineBlock({
  name: 'featured-items',
  is_root: false,
  is_nestable: true,
  folder: blocksFolder,
  color: '#dfe3e8',
  description: 'A section to point out images or blog posts.',
  fields: [
    defineField('headline', {
      description: 'Large text displayed at the top of the section.',
      required: true,
      type: 'text',
    }),
    defineField('copy', {
      description: 'Optional small text displayed under the headline.',
      type: 'richtext',
    }),
    defineField('items', {
      /*
       * `storyblok schema init` emitted `allow: ['content']` here, which the
       * @storyblok/schema types reject for an `options` field — `allow` is a
       * `bloks`-field property. For a story picker the only restriction key the
       * package accepts is `filter_content_type` (verified by probing the
       * types: restrict_content_types, component_whitelist and
       * restrict_components are all rejected here).
       *
       * NOT verified against a push. Run `npm run schema:diff` before pushing
       * this component; the space also carries `restrict_components: true`,
       * which did not round-trip through the CLI.
       */
      filter_content_type: ['content'],
      description: 'Blog posts to feature.',
      min_options: '',
      source: 'internal_stories',
      type: 'options',
    }),
    defineField('images', {
      description: 'Images to feature.',
      filetypes: [
        'images',
      ],
      type: 'multiasset',
    }),
  ],
});
