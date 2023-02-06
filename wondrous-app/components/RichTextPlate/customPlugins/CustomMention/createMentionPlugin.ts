import { createPluginFactory } from '@udecode/plate-core';

import { ElementTypes } from 'components/RichTextPlate/typescript/plateTypes';
import { mentionOnKeyDownHandler } from './handlers/mentionOnKeyDownHandler';
import { isSelectionInMentionInput } from './queries';
import { MentionPlugin } from './types';
import { withMention } from './withMention';

/**
 * Enables support for autocompleting @mentions.
 */
export const createCustomMentionPlugin = createPluginFactory<MentionPlugin>({
  key: ElementTypes.ELEMENT_MENTION,
  isElement: true,
  isInline: true,
  isVoid: true,
  handlers: {
    onKeyDown: mentionOnKeyDownHandler({ query: isSelectionInMentionInput }),
  },
  withOverrides: withMention,
  options: {
    trigger: '@',
    createMentionNode: (item: any) => ({ value: item.data.mentionType === '@' ? `@${item.text}` : '' }),
  },
  plugins: [
    {
      key: ElementTypes.ELEMENT_MENTION_INPUT,
      isElement: true,
      isInline: true,
    },
  ],
  then: (editor, { key }) => ({
    options: {
      id: key,
    },
  }),
});
