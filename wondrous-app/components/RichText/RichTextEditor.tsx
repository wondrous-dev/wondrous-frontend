import Typography from '@mui/material/Typography';
import { BaseRange, Descendant, Editor, Range } from 'slate';
import { DefaultElement, RenderElementProps, Slate } from 'slate-react';

import SlashCommand from 'components/RichText/features/SlashCommand/SlashCommand';
import useSlashCommand from 'components/RichText/features/SlashCommand/useSlashCommand';
import { useState } from 'react';
import Portal from './components/Portal';
import Toolbar from './components/Toolbar';
import { Leaf, LinkElement, MentionElement, SlashCommandElement } from './elements';
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
    case 'slashCommand':
      return <SlashCommandElement {...props} />;
    case 'link':
      return <LinkElement {...props} />;
    case 'bulleted-list':
      return <BulletedList {...props} />;
    case 'numbered-list':
      return <NumberedList {...props} />;
    case 'headingOne':
      return (
        <Typography {...props} variant="h1">
          {props.children}
        </Typography>
      );
    case 'headingTwo':
      return <Typography variant="h2">{props.children}</Typography>;
    case 'headingThree':
      return <Typography variant="h3">{props.children}</Typography>;
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
  const [selectionOverride, setSelectionOverride] = useState<BaseRange | null>(null);
  const [initialLinkText, setInitialLinkText] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // const { text } = initialValue[0].children[0];
  //
  // let isOdd = false;
  //
  // const quotes = text.split('').reduce((str, char) => {
  //   if (char === '"') {
  //     isOdd = !isOdd;
  //
  //     str += isOdd ? '„' : '“';
  //     return str;
  //   }
  //
  //   return str + char;
  // }, '');

  const handleInsertLink = () => {
    if (EditorHelpers.isBlockActive(editor, 'link')) {
      EditorHelpers.unwrapLink(editor);

      return;
    }

    if (Range.isCollapsed(editor.selection)) {
      setSelectionOverride(null);
    } else {
      setSelectionOverride(editor.selection);
      setInitialLinkText(Editor.string(editor, editor.selection));
    }
    setIsLinkModalOpen(true);
  };

  const slashCommandActions = [
    {
      name: 'Bulleted List',
      command: 'bulleted-list',
      action: () => EditorHelpers.toggleBlock(editor, 'bulleted-list'),
    },
    {
      name: 'Numbered List',
      command: 'numbered-list',
      action: () => EditorHelpers.toggleBlock(editor, 'numbered-list'),
    },
    // {
    //   name: 'To-do list',
    //   command: 'list-item',
    //   action: () => EditorHelpers.toggleBlock(editor, 'list-item'),
    // },
    {
      name: 'Code',
      command: 'code',
      action: () => EditorHelpers.toggleMark(editor, 'code'),
    },
    {
      name: 'Heading 1',
      command: 'h1',
      action: () => EditorHelpers.toggleMark(editor, 'headingOne'),
    },
    {
      name: 'Heading 2',
      command: 'h2',
      action: () => EditorHelpers.toggleMark(editor, 'headingTwo'),
    },
    {
      name: 'Heading 3',
      command: 'h3',
      action: () => EditorHelpers.toggleMark(editor, 'headingThree'),
    },
    {
      name: 'Link',
      command: 'link',
      action: () => handleInsertLink(),
    },
    // {
    //   name: 'Image',
    //   command: 'image',
    //   action: () => EditorHelpers.wrapLink(editor, ''),
    // },
  ];

  const mentions = useMentions({ editor, mentionables, onMentionChange });
  const slashCommands = useSlashCommand({ editor, slashCommandActions });

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
        slashCommands.handlers.onChange();
      }}
    >
      <Portal node={toolbarNode}>
        <Toolbar
          selectionOverride={selectionOverride}
          initialLinkText={initialLinkText}
          isLinkModalOpen={isLinkModalOpen}
          handleInsertLink={handleInsertLink}
          setIsLinkModalOpen={setIsLinkModalOpen}
        />
      </Portal>

      <StyledEditable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          EditorHelpers.handleHotkeys(editor, event);
          EditorHelpers.handleStepOutOfBlock(editor, event);
          EditorHelpers.handleStepOutOfListOnEnter(editor, event);
          EditorHelpers.handleStepOutOfHeadingOnEnter(editor, event);
          mentions.handlers.onKeyDown(event);
          slashCommands.handlers.onKeyDown(event);
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
      <SlashCommand
        portalNode={portalNode}
        editorContainerNode={editorContainerNode}
        {...slashCommands.props}
        {...slashCommands.commands}
      />
    </Slate>
  );
};

export default RichTextEditor;
