import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { contentFolder } from '../../folders';

export const blogPostBlock = defineBlock({
  name: 'blog-post',
  is_root: false,
  is_nestable: true,
  folder: contentFolder,
  color: '#dfe3e8',
  description: 'Used to create posts under the Blog directory.',
  fields: [
    defineField('body', {
      description: 'The blog post content.',
      required: true,
      type: 'richtext',
    }),
    defineField('excerpt', {
      description: 'An optional short blurb about the blog post\'s contents. Displays in the blog listing and below the blog post title, if present.',
      type: 'textarea',
    }),
    defineField('hero', {
      description: 'An optional image displayed when the post is featured, in the blog listing, and in the post itself.',
      filetypes: [
        'images',
      ],
      required: false,
      type: 'asset',
    }),
    defineField('show_hero', {
      default_value: 'yes',
      description: 'Whether to show the hero between the title and content.',
      options: [
        {
          _uid: '6e141c17-bf0f-4b3c-9544-ea51bec32bed',
          name: 'Yes',
          value: 'yes',
        },
        {
          _uid: '7dd30ecf-bfc9-4f2e-a6ef-22ee4744dde9',
          name: 'No',
          value: 'no',
        },
      ],
      type: 'option',
      use_uuid: true,
    }),
    defineField('tab-78e9879a-a9c9-4251-99c8-7e22bea952c3', {
      display_name: 'Content',
      keys: [
        'body',
      ],
      type: 'tab',
    }),
    defineField('tab-cbff14a4-ab3a-4826-90d1-e04a80467c6a', {
      display_name: 'Config',
      keys: [
        'show_hero',
        'hero',
        'excerpt',
      ],
      type: 'tab',
    }),
  ],
});
