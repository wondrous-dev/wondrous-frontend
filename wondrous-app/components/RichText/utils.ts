import { Descendant } from 'slate';

import { CustomMentionElement } from './types';

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

  return text.split('\n').map((line) => {
    return {
      children: [{ text: line }],
      type: 'paragraph',
    };
  });
};

export const deserializeRichText = (text: string = ''): Descendant[] => {
  try {
    let parsed = JSON.parse(text);

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
    JSON.parse(text);

    return true;
  } catch (e) {
    return false;
  }
};

export const trimRichText = (nodes: Descendant[]) => {
  return nodes; // TODO
};

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
