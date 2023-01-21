import { useState } from 'react';
import { createEditor, Range } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import isUrl from 'is-url';

import withSlashCommand from 'components/RichText/features/SlashCommand/withSlashCommand';
import EditorHelpers from './helpers';
import { CustomEditor, CustomElement, TogglabaleBlock } from './types';
import withMentions from './features/mentions/withMentions';

const withLinks = (editor: CustomEditor) => {
  const { isInline, insertText } = editor;

  editor.isInline = (element) => (element.type === 'link' ? true : isInline(element));

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      EditorHelpers.wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  return editor;
};

const withDeleteEmptyBlock = (editor: CustomEditor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    if (selection && selection.focus.offset === 0 && selection.anchor.offset === 0 && Range.isCollapsed(selection)) {
      const node = editor.children[selection.anchor.path[0]] as CustomElement | undefined;

      if ((node?.type === 'list-item' || node?.type.endsWith('list')) && node.children.length === 1) {
        EditorHelpers.toggleBlock(editor, node?.type as TogglabaleBlock['type']);
      }
      deleteBackward(unit);
    } else {
      deleteBackward(unit);
    }
  };

  return editor;
};

// instead of nesting function calls, we can use a reducer
const plugins = [withDeleteEmptyBlock, withLinks, withMentions, withSlashCommand, withReact, withHistory];
const applyPlugins = (editor: CustomEditor) => plugins.reduceRight((editor, plugin) => plugin(editor), editor);

const useEditor = () => {
  const [editor] = useState(() => applyPlugins(createEditor()));

  return editor;
};

export default useEditor;
