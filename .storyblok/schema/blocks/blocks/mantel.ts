import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { blocksFolder } from '../../folders';

export const mantelBlock = defineBlock({
  name: 'mantel',
  is_root: false,
  is_nestable: true,
  folder: blocksFolder,
  color: '#dfe3e8',
  description: 'The top of the homepage.',
  fields: [
    defineField('headline', {
      description: 'Large text displayed in the mantel.',
      required: true,
      type: 'text',
    }),
    defineField('copy', {
      description: 'Optional, smaller text that displays under the headline.',
      type: 'textarea',
    }),
    defineField('image', {
      description: 'Optional image to use as background for the mantel.',
      filetypes: [
        'images',
      ],
      type: 'asset',
    }),
  ],
});
