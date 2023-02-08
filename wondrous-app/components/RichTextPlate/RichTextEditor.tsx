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
  ELEMENT_LINK,
  Plate,
  PlateProvider,
  StyledElement,
  withProps,
  ELEMENT_MENTION_INPUT,
  TEditableProps,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  createMentionPlugin,
} from '@udecode/plate';
import { TComboboxItem } from '@udecode/plate-combobox';

import { ToolbarButtons } from 'components/RichTextPlate/ToolbarButtons';
import { MarkBalloonToolbar } from 'components/RichTextPlate/plugins/balloon-toolbar/MarkBalloonToolbar';
import { autoformatPlugin } from 'components/RichTextPlate/plugins/autoformat/autoformatPlugin';
// import { createCustomMentionPlugin } from 'components/RichTextPlate/customPlugins/CustomMention';
import { MentionCombobox, MentionElement } from 'components/RichTextPlate/customPlugins/ui/mention';
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
import { createCustomLinkPlugin } from 'components/RichTextPlate/customPlugins/CustomLink';
import { exitBreakPlugin } from './plugins/exit-break/exitBreakPlugin';
import { resetBlockTypePlugin } from './plugins/reset-node/resetBlockTypePlugin';
import { softBreakPlugin } from './plugins/soft-break/softBreakPlugin';
import { Toolbar } from './plugins/toolbar/Toolbar';
import { createMyPlugins, ElementTypes, CustomEditor, TextEditorValue } from './typescript/plateTypes';
import { emojiPlugin } from './plugins/emoji/emojiPlugin';
import { linkPlugin } from './plugins/link/linkPlugin';
import palette from '../../theme/palette';

interface Props {
  inputValue: TextEditorValue;
  onChange: (value) => void;
  mentionables?: { display: string; id: string; profilePicture?: string }[];
  mediaUploads?: () => void;
  placeholder?: string;
}

const headingStyles: CSSProperties = {
  margin: 0,
  color: 'inherit',
};

const components = createPlateUI({
  [ELEMENT_H1]: withProps(StyledElement, {
    styles: {
      root: {
        ...headingStyles,
        fontWeight: 700,
        lineHeight: '60px',
        fontSize: '28px',
      },
    },
  }),
  [ELEMENT_H1]: withProps(StyledElement, {
    styles: {
      root: {
        ...headingStyles,
        fontWeight: 700,
        lineHeight: '60px',
        fontSize: '28px',
      },
    },
  }),
  [ELEMENT_H2]: withProps(StyledElement, {
    styles: {
      root: {
        ...headingStyles,
        fontWeight: 900,
        lineHeight: '48px',
        fontSize: '22px',
      },
    },
  }),
  [ELEMENT_H3]: withProps(StyledElement, {
    styles: {
      root: {
        margin: 0,
        color: 'inherit',
        fontWeight: 900,
        lineHeight: '40px',
        fontSize: '16px',
      },
    },
  }),
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
        marginTop: '0',
        marginBottom: '0',
        marginLeft: '1px',
        marginRight: '1px',
        padding: '0 1px',
        verticalAlign: 'baseline',
        display: 'inline-block',
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
      key: ElementTypes.ELEMENT_H1,
      text: 'Heading 1',
      data: { icon: <HeaderIcon title="H1" /> },
    },
    {
      key: ElementTypes.ELEMENT_H2,
      text: 'Heading 2',
      data: { icon: <HeaderIcon title="H2" /> },
    },
    {
      key: ElementTypes.ELEMENT_H3,
      text: 'Heading 3',
      data: { icon: <HeaderIcon title="H3" /> },
    },
    {
      key: ElementTypes.MARK_BOLD,
      text: 'Bold',
      data: { icon: <BoldIcon /> },
    },
    {
      key: ElementTypes.MARK_ITALIC,
      text: 'Italics',
      data: { icon: <ItalicIcon /> },
    },
    {
      key: ElementTypes.MARK_UNDERLINE,
      text: 'Underline',
      data: { icon: <UnderlineIcon /> },
    },
    {
      key: ElementTypes.MARK_STRIKETHROUGH,
      text: 'Strikethrough',
      data: { icon: <StrikethroughIcon /> },
    },
    {
      key: ElementTypes.ELEMENT_UL,
      text: 'Bulletted List',
      data: { icon: <BulletedListIcon /> },
    },
    {
      key: ElementTypes.ELEMENT_OL,
      text: 'Numbered List',
      data: { icon: <NumberedListIcon /> },
    },
    {
      key: ElementTypes.ELEMENT_LINK,
      text: 'Add Link',
      data: { icon: <LinkIcon /> },
    },
    {
      key: ElementTypes.ELEMENT_IMAGE,
      text: 'Add Image',
      data: { icon: <AddImageIcon /> },
    },
    {
      key: ElementTypes.ELEMENT_BLOCKQUOTE,
      text: 'Add Quote',
      data: { icon: <AddQuoteIcon /> },
    },
  ];

  const editableProps: TEditableProps<TextEditorValue> = {
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
            options: { query: { allow: [ElementTypes.ELEMENT_HR] } },
          }),
          createCustomLinkPlugin(linkPlugin),
          createResetNodePlugin(resetBlockTypePlugin),
          createListPlugin(),
          createBoldPlugin(),
          createCodePlugin(),
          createItalicPlugin(),
          createUnderlinePlugin(),
          createStrikethroughPlugin(),
          createAutoformatPlugin<AutoformatPlugin<TextEditorValue, CustomEditor>, TextEditorValue, CustomEditor>(
            autoformatPlugin
          ),
          createSoftBreakPlugin(softBreakPlugin),
          createExitBreakPlugin(exitBreakPlugin),
          createComboboxPlugin(),
          createMentionPlugin(),
          createMentionPlugin({
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
    <PlateProvider<TextEditorValue>
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
