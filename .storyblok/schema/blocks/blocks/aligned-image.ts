import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { blocksFolder } from '../../folders';

export const alignedImageBlock = defineBlock({
  name: 'aligned-image',
  is_root: false,
  is_nestable: true,
  folder: blocksFolder,
  color: '#dfe3e8',
  description: 'A section with text and an image, configurable to change the position of the image above or below the text.',
  fields: [
    defineField('title', {
      type: 'text',
    }),
    defineField('content', {
      type: 'richtext',
    }),
    defineField('image', {
      filetypes: [
        'images',
      ],
      type: 'asset',
    }),
    defineField('alignment', {
      default_value: 'right',
      options: [
        {
          _uid: 'd7d5cda9-1c55-4fdc-b7e0-e7cb340ecc39',
          name: 'Top',
          value: 'right',
        },
        {
          _uid: '549b6f48-529f-40ff-b062-fd008885cb34',
          name: 'Bottom',
          value: 'left',
        },
      ],
      type: 'option',
      use_uuid: true,
    }),
  ],
});
