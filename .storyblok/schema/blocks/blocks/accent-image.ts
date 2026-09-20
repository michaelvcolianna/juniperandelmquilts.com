import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { blocksFolder } from '../../folders';

export const accentImageBlock = defineBlock({
  name: 'accent-image',
  is_root: false,
  is_nestable: true,
  folder: blocksFolder,
  color: '#dfe3e8',
  description: 'An image with a border, no text overlaid. It is tall on small screens, wide on larger ones.',
  fields: [
    defineField('image', {
      description: '',
      filetypes: [
        'images',
      ],
      required: true,
      type: 'asset',
    }),
  ],
});
