import { KeyboardEvent, useState } from 'react';
import { Descendant, Editor, Range, Transforms } from 'slate';

import { CustomEditor } from 'components/RichText/types';
import EditorHelpers from 'components/RichText/helpers';

const useSlashCommand = ({
  editor,
  slashCommandActions,
}: {
  editor: CustomEditor;
  slashCommandActions: {
    name: string;
    command: string;
    action: () => void;
  }[];
}) => {
  const [slashCommandTarget, setSlashCommandTarget] = useState<Range | undefined>();
  const [activeSlashCommandIndex, setActiveSlashCommandIndex] = useState(0);
  const [mentionSearch, setMentionSearch] = useState('');

  const onChange = () => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: 'word' });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);
      const beforeMatch = beforeText && beforeText.match(/^\/(\w+)$/);
      const after = Editor.after(editor, start);
      const afterRange = Editor.range(editor, start, after);
      const afterText = Editor.string(editor, afterRange);
      const afterMatch = afterText.match(/^(\s|$)/);

      if (afterMatch && beforeMatch) {
        setSlashCommandTarget(beforeRange);
        setActiveSlashCommandIndex(0);
        return;
      }
    }

    setSlashCommandTarget(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (slashCommandTarget) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          const prevIndex = activeSlashCommandIndex >= slashCommandActions.length - 1 ? 0 : activeSlashCommandIndex + 1;
          setActiveSlashCommandIndex(prevIndex);
          break;
        case 'ArrowUp':
          event.preventDefault();
          const nextIndex = activeSlashCommandIndex <= 0 ? slashCommandActions.length - 1 : activeSlashCommandIndex - 1;
          setActiveSlashCommandIndex(nextIndex);
          break;
        case 'Tab':
        case 'Enter':
          event.preventDefault();
          Transforms.select(editor, slashCommandTarget);
          // slashCommandActions[activeSlashCommandIndex].action();
          EditorHelpers.insertSlashCommand(
            editor,
            slashCommandActions[activeSlashCommandIndex].command,
            slashCommandActions[activeSlashCommandIndex].action()
          );
          setSlashCommandTarget(null);
          break;
        case 'Escape':
          event.preventDefault();
          setSlashCommandTarget(null);
          break;
      }
    }
  };

  return {
    props: {
      slashCommandActions,
      mentionSearch,
      slashCommandTarget,
      activeSlashCommandIndex,
    },
    handlers: {
      onChange,
      onKeyDown,
    },
    commands: {
      setSlashCommandTarget,
    },
  };
};

export default useSlashCommand;
