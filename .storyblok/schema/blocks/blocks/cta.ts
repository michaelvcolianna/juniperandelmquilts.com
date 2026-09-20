import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { blocksFolder } from '../../folders';

export const ctaBlock = defineBlock({
  name: 'cta',
  display_name: 'Call to Action',
  is_root: false,
  is_nestable: true,
  folder: blocksFolder,
  color: '#dfe3e8',
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
  ],
});
