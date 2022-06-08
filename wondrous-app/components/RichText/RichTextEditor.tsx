import { Editor, Descendant, Range, Transforms } from 'slate';
import { DefaultElement, Editable, RenderElementProps, Slate } from 'slate-react';

import EditorHelpers from './helpers';
import { Leaf, LinkElement, MentionElement } from './elements';
import { CustomEditor, CustomElement } from './types';
import { BulletedList, NumberedList } from './styles';
import { plainTextToRichText } from './utils';
import Toolbar from './components/Toolbar';
import Portal from './components/Portal';
import useMentions from './features/mentions/useMentions';
import Mentions from './features/mentions/Mentions';

interface Props {
  editor: CustomEditor;
  initialValue?: Descendant[];
  mentionables: { display: string; id: string; profilePicture?: string }[];
  onChange: (value: Descendant[]) => void;

  /** Node to render toolbar to */
  toolbarNode?: HTMLElement;

  /** Node to render mentions popper to */
  portalNode?: HTMLElement;

  /**
   * Should be provided if Editor is rendered in a scrolling container like a modal,
   * otherwise mentions combobox will not work correctly
   */
  editorContainerNode?: HTMLElement;

  placeholder?: React.ReactNode;
}

const renderLeaf = (props) => {
  return <Leaf {...props} />;
};

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

const RichTextEditor: React.FC<Props> = ({
  editor,
  initialValue = plainTextToRichText(''),
  placeholder,
  mentionables,
  portalNode,
  toolbarNode,
  editorContainerNode,
  onChange,
}) => {
  const mentions = useMentions({ editor, mentionables });

  return (
    <Slate
      value={initialValue}
      editor={editor}
      onChange={(value) => {
        const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type);
        if (isAstChange) {
          onChange(value);
        }

        mentions.handlers.onChange();
      }}
    >
      <Portal node={toolbarNode}>
        <Toolbar />
      </Portal>

      <Editable
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
