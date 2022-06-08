import EditorHelpers from 'components/RichText/helpers';
import { CustomEditor } from 'components/RichText/types';
import { KeyboardEvent, useState } from 'react';
import { Editor, Range, Transforms } from 'slate';

const useMentions = ({
  editor,
  mentionables,
}: {
  editor: CustomEditor;
  mentionables: { display: string; id: string; profilePicture?: string }[];
}) => {
  const [mentionTarget, setMentionTarget] = useState<Range | undefined>();
  const [activeMentionIndex, setActiveMentionIndex] = useState(0);
  const [mentionSearch, setMentionSearch] = useState('');

  const foundMentionables = mentionables
    .filter((m) => m.display.toLowerCase().startsWith(mentionSearch.toLowerCase()))
    .slice(0, 10);

  const onChange = () => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: 'word' });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);
      const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
      const after = Editor.after(editor, start);
      const afterRange = Editor.range(editor, start, after);
      const afterText = Editor.string(editor, afterRange);
      const afterMatch = afterText.match(/^(\s|$)/);

      if (afterMatch && beforeMatch) {
        setMentionTarget(beforeRange);
        setMentionSearch(beforeMatch[1]);
        setActiveMentionIndex(0);
        return;
      }
    }

    setMentionTarget(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (mentionTarget) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          const prevIndex = activeMentionIndex >= foundMentionables.length - 1 ? 0 : activeMentionIndex + 1;
          setActiveMentionIndex(prevIndex);
          break;
        case 'ArrowUp':
          event.preventDefault();
          const nextIndex = activeMentionIndex <= 0 ? foundMentionables.length - 1 : activeMentionIndex - 1;
          setActiveMentionIndex(nextIndex);
          break;
        case 'Tab':
        case 'Enter':
          event.preventDefault();
          Transforms.select(editor, mentionTarget);
          EditorHelpers.insertMention(
            editor,
            foundMentionables[activeMentionIndex].display,
            foundMentionables[activeMentionIndex].id
          );
          setMentionTarget(null);
          break;
        case 'Escape':
          event.preventDefault();
          setMentionTarget(null);
          break;
      }
    }
  };

  return {
    props: {
      mentionables,
      mentionSearch,
      mentionTarget,
      activeMentionIndex,
      foundMentionables,
    },
    handlers: {
      onChange,
      onKeyDown,
    },
    commands: {
      setMentionTarget,
    },
  };
};

export default useMentions;
