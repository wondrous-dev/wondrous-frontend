import isHotkey from 'is-hotkey';
import { KeyboardEvent } from 'react';
import { BaseRange, Editor, Element, Range, Text, Transforms } from 'slate';

import {
  CustomEditor,
  CustomElement,
  FormattedText,
  LinkElement,
  MarkType,
  CustomMentionElement,
  TogglabaleBlock,
  CustomSlashCommandElement,
} from './types';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const EditorHelpers = {
  handleHotkeys: (editor: CustomEditor, event: KeyboardEvent<HTMLDivElement>) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        EditorHelpers.toggleMark(editor, mark);
      }
    }
  },

  handleStepOutOfBlock: (editor: CustomEditor, event: KeyboardEvent<HTMLDivElement>) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        Transforms.move(editor, { unit: 'offset', reverse: true });
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        Transforms.move(editor, { unit: 'offset' });
      }

      if (event.key === 'Enter') {
        const [above] = Editor.above(editor);

        const isAboveLink = above && (above as CustomElement).type === 'link';

        if (isAboveLink) {
          Transforms.move(editor, { unit: 'offset' });
        }
      }

      if (event.key === 'Backspace') {
        const [above, location] = Editor.above(editor);

        const hasJustErasedLastLetterInBlock = above && (above as CustomElement).children[0].text?.length === 1;
        const isLink = above && (above as CustomElement).type === 'link';

        if (hasJustErasedLastLetterInBlock && isLink) {
          Transforms.delete(editor, { at: location, unit: 'line' });
          Editor.insertText(editor, ' ');
        }
      }
    }
  },

  handleStepOutOfListOnEnter: (editor: CustomEditor, event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      const [above, location] = Editor.above(editor);
      const isListItem = above && (above as CustomElement).type === 'list-item';
      const isEmpty = (above as CustomElement).children[0].text?.length === 0;

      if (isListItem && isEmpty) {
        event.preventDefault();

        const listLocation = location.slice(0, -1);
        const lastListItem = listLocation[listLocation.length - 1];
        const newParagraphLocation = [...listLocation.slice(0, -1), lastListItem + 1];

        Transforms.delete(editor, { at: location, unit: 'line' });
        Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] }, { at: newParagraphLocation });
        Transforms.select(editor, newParagraphLocation);
      }
    }
  },

  handleStepOutOfHeadingOnEnter: (editor: CustomEditor, event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      const [above]: any = Editor.above(editor);
      const isHeading =
        above?.children[0]?.headingOne || above?.children[0]?.headingTwo || above?.children[0]?.headingThree;
      if (isHeading) {
        event.preventDefault();
        Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] });
      }
    }
  },

  toggleBlock(editor, blockType: TogglabaleBlock['type']) {
    const isActive = EditorHelpers.isBlockActive(editor, blockType);
    const isList = blockType.endsWith('list');

    Transforms.unwrapNodes(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type?.endsWith('list'),
      split: true,
    });

    let newProperties: Partial<Element>;
    newProperties = {
      type: isActive ? 'paragraph' : 'list-item',
    };

    Transforms.setNodes<Element>(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: blockType, children: [] as CustomElement[] } as TogglabaleBlock;
      Transforms.wrapNodes(editor, block);
    }
  },
  isBlockActive(editor, blockType) {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === blockType,
      })
    );

    return !!match;
  },

  isMarkActive(editor, markType: MarkType) {
    const [match] = Editor.nodes(editor, {
      match: (n) => (n as FormattedText)[markType] === true,
      universal: true,
    });

    return !!match;
  },

  toggleMark(editor, markType: MarkType) {
    const isActive = EditorHelpers.isMarkActive(editor, markType);

    if (isActive) {
      Editor.removeMark(editor, markType);
    } else {
      Editor.addMark(editor, markType, true);
    }
  },

  insertMention(editor, mentionable, id: string) {
    const mention: CustomMentionElement = {
      type: 'mention',
      mentionable,
      id,
      children: [{ text: `@${mentionable}` }],
    };
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
  },

  insertSlashCommand(editor, command, action) {
    const slashCommand: CustomSlashCommandElement = {
      type: 'slashCommand',
      command,
      action,
      children: [{ text: `` }],
    };
    Transforms.insertNodes(editor, slashCommand);
    Transforms.move(editor);
  },

  isLinkActive(editor) {
    const [link] = Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });
    return !!link;
  },

  unwrapLink(editor) {
    Transforms.unwrapNodes(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });
  },

  wrapLink(editor: CustomEditor, href: string, text?: string, selectionOverride?: BaseRange) {
    if (EditorHelpers.isLinkActive(editor)) {
      EditorHelpers.unwrapLink(editor);
    }

    const { selection } = editor;
    const isCollapsed = (selectionOverride || selection) && Range.isCollapsed(selectionOverride || selection);
    const link: LinkElement = {
      type: 'link',
      href,
      children: isCollapsed ? [{ text: text || href }] : [],
    };

    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, { split: true, at: selectionOverride || selection });
      Transforms.collapse(editor, { edge: 'end' });
    }
  },
};

export default EditorHelpers;
