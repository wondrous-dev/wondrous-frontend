import { ElementTypes } from 'components/PlateRichEditor/types';

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

export const convertSlateNodesToPlate = (nodes) => {
  return nodes.reduce((acc, currentValue) => {
    const newValue = { ...currentValue };
    const heading = (newValue?.children || [])[0] || {};

    if (heading.headingOne) {
      newValue.type = ElementTypes.ELEMENT_H1;
    } else if (heading.headingTwo) {
      newValue.type = ElementTypes.ELEMENT_H2;
    } else if (heading.headingThree) {
      newValue.type = ElementTypes.ELEMENT_H3;
    } else if (newValue.type === 'bulleted-list') {
      newValue.type = ElementTypes.ELEMENT_UL;
    } else if (newValue.type === 'list-item') {
      newValue.type = ElementTypes.ELEMENT_LI;
    } else if (newValue.type === 'numbered-list') {
      newValue.type = ElementTypes.ELEMENT_OL;
    } else if (newValue.type === 'link') {
      newValue.type = ElementTypes.ELEMENT_LINK;
      newValue.url = newValue.href;
    } else if (newValue.type === 'mention') {
      newValue.value = `@${newValue.mentionable}`;
    }

    if (newValue.children) {
      newValue.children = convertSlateNodesToPlate(newValue.children);
    }

    return [...acc, newValue];
  }, []);
};
