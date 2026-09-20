import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { blocksFolder, contentFolder } from '../folders';

export const contentBlock = defineBlock({
  name: 'content',
  is_root: true,
  is_nestable: false,
  color: '#dfe3e8',
  description: 'A page, either regular or a shell for use with a blog post.',
  fields: [
    defineField('tab-c2f8a4ce-1a3d-4a71-8e95-73fd7b5e5519', {
      display_name: 'Content',
      keys: [
        'body',
      ],
      name: 'tab-c2f8a4ce-1a3d-4a71-8e95-73fd7b5e5519',
      type: 'tab',
    }),
    defineField('description', {
      description: 'An optional short blurb about the page\'s contents. Displays in search engine results and in social shares. An excerpt of the page content may be used if left blank.',
      required: false,
      type: 'textarea',
    }),
    defineField('tab-69539691-c25f-42a2-8cc0-82b6fb017161', {
      display_name: 'Meta Info',
      keys: [
        'card',
        'description',
      ],
      type: 'tab',
    }),
    defineField('card', {
      description: 'An optional image that shows up in social shares. The best size is 1200x630 pixels. Different from the hero image used for display on the site.',
      filetypes: [
        'images',
      ],
      required: false,
      type: 'asset',
    }),
    defineField('body', {
      allow: [
        blocksFolder,
        contentFolder,
      ],
      type: 'bloks',
    }),
  ],
});
