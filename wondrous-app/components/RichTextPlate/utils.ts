import { ElementTypes } from 'components/RichTextPlate/types';

export const extractMentions = (nodes) => {
  const result: string[] = [];

  for (const node of nodes) {
    const { type, children } = node;

    if (type === ElementTypes.ELEMENT_MENTION) {
      result.push(node.id);
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
