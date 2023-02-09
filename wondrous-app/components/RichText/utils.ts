import { Descendant } from 'slate';

import { CustomMentionElement, FormattedText, ParagraphElement } from './types';

/** Deserialize plain text to Slate state */
export const plainTextToRichText = (text: string): Descendant[] => {
  if (!text) {
    return [
      {
        children: [{ text: '' }],
        type: 'paragraph',
      },
    ];
  }
  if (typeof text !== 'string') {
    return [
      {
        children: [{ text: '' }],
        type: 'paragraph',
      },
    ];
  }
  return text.split('\n').map((line) => {
    function parseMentionsInPlaintext(text: string): ParagraphElement['children'] {
      // looking for a string like this: @[username](id)
      const mentionStartIndex = text.search(/@\[(.*?)\]\(([0-9]+?)\)/g);
      const mentionEndIndex = text.indexOf(')', mentionStartIndex);

      if (mentionStartIndex !== -1) {
        const mention = text.slice(mentionStartIndex, mentionEndIndex + 1);
        const username = mention.split(/[\[\]]/)[1]; // split by [ and ], username is in 1 index
        const id = mention.split(/[\)\(]/)[1]; // split by ( and ), id is in 1 index

        return [
          { text: text.slice(0, mentionStartIndex) },
          {
            type: 'mention',
            mentionable: username,
            id,
            children: [{ text: `@${username}` }],
          },
          ...parseMentionsInPlaintext(text.slice(mentionEndIndex + 1)),
        ];
      }

      return [{ text }];
    }

    return {
      children: parseMentionsInPlaintext(line),
      type: 'paragraph',
    };
  });
};

export const deserializeRichText = (text: string = ''): Descendant[] => {
  try {
    const parsed = JSON.parse(text);

    return parsed;
  } catch (e) {
    return plainTextToRichText(text);
  }
};

export const isBlankValue = (nodes: Descendant[]): boolean => {
  if (!nodes) {
    return true;
  }

  for (const node of nodes) {
    const hasTextOrMention = node.text || (node as CustomMentionElement).mentionable;
    const isBlank = !hasTextOrMention && isBlankValue(node.children);

    if (!isBlank) {
      return false;
    }
  }

  return true;
};

export const extractMentions = (nodes: Descendant[]) => {
  const result: string[] = [];

  for (const node of nodes) {
    const { type, children } = node;

    if (type === 'mention') {
      result.push((node as CustomMentionElement).id);
    } else if (children) {
      result.push(...extractMentions(children));
    }
  }

  return result;
};

export const isRichText = (text: string) => {
  try {
    const parsed = JSON.parse(text);
    if (!isNaN(parsed)) {
      // edge case because in js JSON.parse('11') return 11
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const trimRichText = (nodes: Descendant[]) => nodes; // TODO

export const countCharacters = (nodes: Descendant[]) => {
  let result = 0;
  let nodesCount = 0;

  for (const node of nodes) {
    if (nodesCount > 0) {
      result += 1; // this will count empty lines as characters
    }

    nodesCount += 1;

    const { text, children } = node;

    if (text) {
      result += text.length;
    }

    if (children) {
      result += countCharacters(children);
    }
  }

  return result;
};
