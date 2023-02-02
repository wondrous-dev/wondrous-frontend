import React, { CSSProperties, useMemo, useRef } from 'react';
import {
  AutoformatPlugin,
  createAutoformatPlugin,
  createBoldPlugin,
  createCodePlugin,
  createComboboxPlugin,
  createEmojiPlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createBlockquotePlugin,
  createHorizontalRulePlugin,
  createItalicPlugin,
  createListPlugin,
  createPlateUI,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTodoListPlugin,
  createUnderlinePlugin,
  ELEMENT_HR,
  ELEMENT_LINK,
  Plate,
  PlateProvider,
  StyledElement,
  withProps,
  ELEMENT_MENTION_INPUT,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  TEditableProps,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  MARK_STRIKETHROUGH,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_BLOCKQUOTE,
} from '@udecode/plate';
import { TComboboxItem } from '@udecode/plate-combobox';

import { ToolbarButtons } from 'components/RichTextPlate/ToolbarButtons';
import { MarkBalloonToolbar } from 'components/RichTextPlate/balloon-toolbar/MarkBalloonToolbar';
import { autoformatPlugin } from 'components/RichTextPlate/autoformat/autoformatPlugin';
import { createCustomMentionPlugin } from 'components/RichTextPlate/custom-components/CustomMention';
import { MentionCombobox, MentionElement } from 'components/RichTextPlate/custom-components/ui/nodes/mention';
import { HeaderIcon } from 'components/RichText/icons/HeaderIcon';
import BoldIcon from 'components/RichTextPlate/icons/BoldIcon';
import ItalicIcon from 'components/RichTextPlate/icons/ItalicIcon';
import UnderlineIcon from 'components/RichTextPlate/icons/UnderlineIcon';
import StrikethroughIcon from 'components/RichTextPlate/icons/StrikethroughIcon';
import BulletedListIcon from 'components/RichTextPlate/icons/BulletedListIcon';
import NumberedListIcon from 'components/RichTextPlate/icons/NumberedListIcon';
import LinkIcon from 'components/RichTextPlate/icons/LinkIcon';
import AddImageIcon from 'components/RichTextPlate/icons/AddImageIcon';
import AddQuoteIcon from 'components/RichTextPlate/icons/AddQuoteIcon';
import { createCustomLinkPlugin } from 'components/RichTextPlate/custom-components/CustomLink';
import { exitBreakPlugin } from './exit-break/exitBreakPlugin';
import { resetBlockTypePlugin } from './reset-node/resetBlockTypePlugin';
import { softBreakPlugin } from './soft-break/softBreakPlugin';
import { Toolbar } from './toolbar/Toolbar';
import { createMyPlugins, CustomElements, MyEditor, MyValue } from './typescript/plateTypes';
import { emojiPlugin } from './emoji/emojiPlugin';
import { linkPlugin } from './link/linkPlugin';
import palette from '../../theme/palette';

interface Props {
  inputValue?;
  mentionables?: { display: string; id: string; profilePicture?: string }[];
  onChange?: (value) => void;
  mediaUploads?: () => void;
  placeholder?: string;
}

const components = createPlateUI({
  [ELEMENT_LINK]: withProps(StyledElement, {
    styles: {
      root: {
        color: palette.highlightBlue,
      },
    },
  }),
  [ELEMENT_MENTION_INPUT]: withProps(StyledElement, {
    styles: {
      root: {
        boxShadow: 'none',
        backgroundColor: 'unset',
      },
    },
  }),
});

const styles: Record<string, CSSProperties> = {
  container: { position: 'relative' },
};

const RichTextEditorPlate = ({ mentionables, inputValue, onChange, mediaUploads, placeholder = 'Type...' }: Props) => {
  const containerRef = useRef(null);

  const customMentionables = mentionables.map((m) => ({
    key: m.id,
    text: m.display,
    data: { img: m.profilePicture, mentionType: '@' },
  }));

  const slashCommandItems: TComboboxItem<any>[] = [
    {
      key: ELEMENT_H1,
      text: 'Heading 1',
      data: { icon: <HeaderIcon title="H1" /> },
    },
    {
      key: ELEMENT_H2,
      text: 'Heading 2',
      data: { icon: <HeaderIcon title="H2" /> },
    },
    {
      key: ELEMENT_H3,
      text: 'Heading 3',
      data: { icon: <HeaderIcon title="H3" /> },
    },
    {
      key: MARK_BOLD,
      text: 'Bold',
      data: { icon: <BoldIcon /> },
    },
    {
      key: MARK_ITALIC,
      text: 'Italics',
      data: { icon: <ItalicIcon /> },
    },
    {
      key: MARK_UNDERLINE,
      text: 'Underline',
      data: { icon: <UnderlineIcon /> },
    },
    {
      key: MARK_STRIKETHROUGH,
      text: 'Strikethrough',
      data: { icon: <StrikethroughIcon /> },
    },
    {
      key: ELEMENT_UL,
      text: 'Bulletted List',
      data: { icon: <BulletedListIcon /> },
    },
    {
      key: ELEMENT_OL,
      text: 'Numbered List',
      data: { icon: <NumberedListIcon /> },
    },
    {
      key: ELEMENT_LINK,
      text: 'Add Link',
      data: { icon: <LinkIcon /> },
    },
    {
      key: CustomElements.Image,
      text: 'Add Image',
      data: { icon: <AddImageIcon /> },
    },
    {
      key: ELEMENT_BLOCKQUOTE,
      text: 'Add Quote',
      data: { icon: <AddQuoteIcon /> },
    },
  ];

  const editableProps: TEditableProps<MyValue> = {
    spellCheck: false,
    autoFocus: false,
    placeholder,
  };

  const plugins = useMemo(
    () =>
      createMyPlugins(
        [
          createTodoListPlugin(),
          createHeadingPlugin(),
          createBlockquotePlugin(),
          createHorizontalRulePlugin(),
          createSelectOnBackspacePlugin({
            options: { query: { allow: [ELEMENT_HR] } },
          }),
          createCustomLinkPlugin(linkPlugin),
          createResetNodePlugin(resetBlockTypePlugin),
          createListPlugin(),
          createBoldPlugin(),
          createCodePlugin(),
          createItalicPlugin(),
          createUnderlinePlugin(),
          createStrikethroughPlugin(),
          createAutoformatPlugin<AutoformatPlugin<MyValue, MyEditor>, MyValue, MyEditor>(autoformatPlugin),
          createSoftBreakPlugin(softBreakPlugin),
          createExitBreakPlugin(exitBreakPlugin),
          createComboboxPlugin(),
          createCustomMentionPlugin(),
          createCustomMentionPlugin({
            key: '/',
            component: MentionElement,
            options: { trigger: '/' },
          }),
          createEmojiPlugin(emojiPlugin),
        ],
        {
          components,
        }
      ),
    []
  );

  return (
    <PlateProvider<MyValue>
      plugins={plugins}
      onChange={(value) => {
        onChange(value);
      }}
      value={inputValue}
    >
      <Toolbar>
        <ToolbarButtons mediaUploads={mediaUploads} />
      </Toolbar>

      <div ref={containerRef} style={styles.container}>
        <Plate editableProps={editableProps}>
          <MarkBalloonToolbar />

          <MentionCombobox items={customMentionables} />
          <MentionCombobox pluginKey="/" items={slashCommandItems} />
        </Plate>
      </div>
    </PlateProvider>
  );
};

export default RichTextEditorPlate;
