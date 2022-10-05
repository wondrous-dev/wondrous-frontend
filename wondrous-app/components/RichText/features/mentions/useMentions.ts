import EditorHelpers from 'components/RichText/helpers';
import { CustomEditor } from 'components/RichText/types';
import { KeyboardEvent, useState } from 'react';
import { Editor, Range, Transforms } from 'slate';

const useMentions = ({
  editor,
  mentionables,
  onMentionChange,
}: {
  editor: CustomEditor;
  mentionables: { display: string; id: string; profilePicture?: string }[];
  onMentionChange: (searchString) => void;
}) => {
  const [mentionTarget, setMentionTarget] = useState<Range | undefined>();
  const [activeMentionIndex, setActiveMentionIndex] = useState(0);
  const [mentionSearch, setMentionSearch] = useState('');

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
        onMentionChange(beforeMatch[1]);
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
          const prevIndex = activeMentionIndex >= mentionables.length - 1 ? 0 : activeMentionIndex + 1;
          setActiveMentionIndex(prevIndex);
          break;
        case 'ArrowUp':
          event.preventDefault();
          const nextIndex = activeMentionIndex <= 0 ? mentionables.length - 1 : activeMentionIndex - 1;
          setActiveMentionIndex(nextIndex);
          break;
        case 'Tab':
        case 'Enter':
          event.preventDefault();
          Transforms.select(editor, mentionTarget);
          EditorHelpers.insertMention(
            editor,
            mentionables[activeMentionIndex].display,
            mentionables[activeMentionIndex].id
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
