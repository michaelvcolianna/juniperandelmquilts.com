import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { blocksFolder } from '../../folders';

export const newsletterSignupBlock = defineBlock({
  name: 'newsletter-signup',
  is_root: false,
  is_nestable: true,
  folder: blocksFolder,
  color: '#dfe3e8',
  description: 'Content for the newsletter form.',
  fields: [
    defineField('headline', {
      description: 'Large text displayed at the top of the section.',
      required: true,
      type: 'text',
    }),
    defineField('copy', {
      description: 'Optional small text displayed under the headline.',
      type: 'textarea',
    }),
    defineField('image', {
      description: 'Optional image to use as background for the section.',
      filetypes: [
        'images',
      ],
      type: 'asset',
    }),
  ],
});
