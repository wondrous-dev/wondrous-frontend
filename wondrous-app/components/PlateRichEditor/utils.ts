import { Descendant, Editor, Transforms } from 'slate';
import cloneDeep from 'lodash/cloneDeep';

import { ElementTypes, MentionElement } from 'components/PlateRichEditor/types';

export const resetEditor = (editor, newValue) => {
  if (editor.children.length > 0) {
    // Delete all entries leaving 1 empty node
    Transforms.delete(editor, {
      at: {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      },
    });

    // Removes empty node
    Transforms.removeNodes(editor, {
      at: [0],
    });
  }

  // Insert array of children nodes
  Transforms.insertNodes(editor, newValue);
};
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
    const parseMentionsInPlaintext = (text: string) => {
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
    };

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
    const hasTextOrMention = node.text || (node as MentionElement).mentionable;
    const isBlank = !hasTextOrMention && isBlankValue(node.children);

    if (!isBlank) {
      return false;
    }
  }

  return true;
};

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

export const convertSlateNodesToPlate = (nodes) =>
  nodes.reduce((acc, currentValue) => {
    const newValue = cloneDeep(currentValue);
    const heading = (newValue?.children || [])[0] || {};

    if (heading.headingOne) {
      newValue.type = ElementTypes.ELEMENT_H1;
      delete heading.headingOne;
    } else if (heading.headingTwo) {
      newValue.type = ElementTypes.ELEMENT_H2;
      delete heading.headingTwo;
    } else if (heading.headingThree) {
      newValue.type = ElementTypes.ELEMENT_H3;
      delete heading.headingThree;
    }

    switch (newValue.type) {
      case 'bulleted-list':
        newValue.type = ElementTypes.ELEMENT_UL;
        break;
      case 'numbered-list':
        newValue.type = ElementTypes.ELEMENT_OL;
        break;
      case 'paragraph':
        newValue.type = ElementTypes.ELEMENT_DEFAULT;
        break;
      case 'mention':
        newValue.value = `@${newValue.mentionable}`;

        if (newValue.children) {
          newValue.children[0].text = '';
        }

        break;
      case 'link':
        {
          newValue.type = ElementTypes.ELEMENT_LINK;
          newValue.url = newValue.href;
          newValue.target = '_blank';

          delete newValue.href;
        }
        break;
      case 'list-item':
        {
          newValue.type = ElementTypes.ELEMENT_LI;

          const { children } = newValue;

          newValue.children = [
            {
              children,
              type: 'lic',
            },
          ];
        }
        break;
      default:
        break;
    }

    if (newValue.children) {
      newValue.children = convertSlateNodesToPlate(newValue.children);
    }

    return [...acc, newValue];
  }, []);
