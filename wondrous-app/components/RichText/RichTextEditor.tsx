import { Descendant } from 'slate';
import { DefaultElement, RenderElementProps, Slate } from 'slate-react';

import Portal from './components/Portal';
import Toolbar from './components/Toolbar';
import { Leaf, LinkElement, MentionElement } from './elements';
import Mentions from './features/mentions/Mentions';
import useMentions from './features/mentions/useMentions';
import EditorHelpers from './helpers';
import { BulletedList, NumberedList, StyledEditable } from './styles';
import { CustomEditor } from './types';
import { plainTextToRichText } from './utils';

interface Props {
  editor: CustomEditor;
  initialValue?: Descendant[];
  mentionables: { display: string; id: string; profilePicture?: string }[];
  onChange: (value: Descendant[]) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;

  /** Node to render toolbar to */
  toolbarNode?: HTMLElement;
  /** Node to render mentions popper to */
  portalNode?: HTMLElement;

  /**
   * Should be provided if Editor is rendered in a scrolling container like a modal,
   * otherwise mentions combobox will not work correctly
   */
  editorContainerNode: HTMLElement;

  placeholder?: React.ReactNode;
  onMentionChange: (query: string) => Promise<any>;
}

const renderLeaf = (props) => <Leaf {...props} />;

const renderElement = (props: RenderElementProps) => {
  switch (props.element.type) {
    case 'mention':
      return <MentionElement {...props} />;
    case 'link':
      return <LinkElement {...props} />;
    case 'bulleted-list':
      return <BulletedList {...props} />;
    case 'numbered-list':
      return <NumberedList {...props} />;
    case 'list-item':
      return <li {...props.attributes}>{props.children}</li>;
    default:
      return <DefaultElement {...props} />;
  }
};

/**
 * This text editor is based on Slate.
 * Before making changes to low level parts like EditorHelpers
 * it is highly recommended to read Concepts section in Slate docs.
 * See https://docs.slatejs.org/concepts/01-interfaces
 */
const RichTextEditor: React.FC<Props> = ({
  editor,
  initialValue = plainTextToRichText(''),
  placeholder,
  mentionables,
  portalNode,
  toolbarNode,
  editorContainerNode,
  onChange,
  onClick,
  onMentionChange,
}) => {
  const mentions = useMentions({ editor, mentionables, onMentionChange });

  return (
    <Slate
      value={initialValue}
      editor={editor}
      onChange={(value) => {
        const isAstChange = editor.operations.some((op) => op.type !== 'set_selection');
        if (isAstChange) {
          onChange(value);
        }

        mentions.handlers.onChange();
      }}
    >
      <Portal node={toolbarNode}>
        <Toolbar />
      </Portal>

      <StyledEditable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          EditorHelpers.handleHotkeys(editor, event);
          EditorHelpers.handleStepOutOfBlock(editor, event);
          EditorHelpers.handleStepOutOfListOnEnter(editor, event);

          mentions.handlers.onKeyDown(event);
        }}
        // we use React.ReactNode placeholder, but types are not compatible, although it works fine
        placeholder={placeholder as any}
        onClick={onClick}
      />
      <Mentions
        portalNode={portalNode}
        editorContainerNode={editorContainerNode}
        {...mentions.props}
        {...mentions.commands}
      />
    </Slate>
  );
};

export default RichTextEditor;
