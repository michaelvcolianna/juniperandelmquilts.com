import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { blocksFolder } from '../../folders';

export const imageGalleryBlock = defineBlock({
  name: 'image-gallery',
  is_root: false,
  is_nestable: true,
  folder: blocksFolder,
  color: '#dfe3e8',
  description: 'A section with multiple images.',
  fields: [
    defineField('images', {
      filetypes: [
        'images',
      ],
      type: 'multiasset',
    }),
  ],
});
