import React, { CSSProperties, useMemo } from 'react';
import {
  AutoformatPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodePlugin,
  createComboboxPlugin,
  createEmojiPlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createHorizontalRulePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createPlateUI,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTodoListPlugin,
  createUnderlinePlugin,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_MENTION_INPUT,
  Plate,
  PlateProvider,
  StyledElement,
  TEditableProps,
  withProps,
} from '@udecode/plate';

import { createCustomMentionPlugin } from 'components/RichTextPlate/customPlugins/CustomMention/createMentionPlugin';
import { slashCommandItems } from 'components/RichTextPlate/constants';
import { ToolbarButtons } from 'components/RichTextPlate/ToolbarButtons';
import { MarkBalloonToolbar } from 'components/RichTextPlate/plugins/balloon-toolbar/MarkBalloonToolbar';
import { autoformatPlugin } from 'components/RichTextPlate/plugins/autoformat/autoformatPlugin';
import { MentionCombobox, MentionElement } from 'components/RichTextPlate/customPlugins/Mention';
import { exitBreakPlugin } from './plugins/exit-break/exitBreakPlugin';
import { resetBlockTypePlugin } from './plugins/reset-node/resetBlockTypePlugin';
import { softBreakPlugin } from './plugins/soft-break/softBreakPlugin';
import { Toolbar } from './plugins/toolbar/Toolbar';
import { createMyPlugins, ElementTypes, CustomEditor, TextEditorValue } from './types';
import { emojiPlugin } from './plugins/emoji/emojiPlugin';
import { linkPlugin } from './plugins/link/linkPlugin';

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

const RichTextEditorPlate = ({ mentionables, inputValue, onChange, mediaUploads, placeholder = 'Type...' }: Props) => {
  const customMentionables = useMemo(
    () =>
      mentionables.map((m) => ({
        key: m.id,
        text: m.display,
        data: { img: m.profilePicture, mentionType: '@' },
      })),
    [mentionables]
  );

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
          createLinkPlugin(linkPlugin),

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

      <Plate editableProps={editableProps}>
        <MarkBalloonToolbar />

        <MentionCombobox items={customMentionables} />
        <MentionCombobox pluginKey="/" items={slashCommandItems} />
      </Plate>
    </PlateProvider>
  );
};

export default RichTextEditorPlate;
