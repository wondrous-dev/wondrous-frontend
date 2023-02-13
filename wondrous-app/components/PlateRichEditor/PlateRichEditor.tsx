import React, { CSSProperties, useMemo } from 'react';
import { PlateStyles } from 'components/PlateRichEditor/styles';
import { convertSlateNodesToPlate } from 'components/PlateRichEditor/utils';
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
import { Descendant } from 'slate';

import { createCustomMentionPlugin } from 'components/PlateRichEditor/customPlugins/CustomMention/createMentionPlugin';
import { slashCommandItems } from 'components/PlateRichEditor/constants';
import { ToolbarButtons } from 'components/PlateRichEditor/ToolbarButtons';
import { MarkBalloonToolbar } from 'components/PlateRichEditor/plugins/balloonToolbar/MarkBalloonToolbar';
import { autoformatPlugin } from 'components/PlateRichEditor/plugins/autoformat/autoformatPlugin';
import { MentionCombobox, MentionElement } from 'components/PlateRichEditor/customPlugins/Mention';
import { Typography } from '@mui/material';
import { exitBreakPlugin } from './plugins/exitBreakPlugin';
import { resetBlockTypePlugin } from './plugins/resetBlockTypePlugin';
import { softBreakPlugin } from './plugins/softBreakPlugin';
import { Toolbar } from './plugins/Toolbar';
import { createMyPlugins, ElementTypes, CustomEditor, TextEditorValue } from './types';
import { emojiPlugin } from './plugins/emojiPlugin';
import { linkPlugin } from './plugins/linkPlugin';
import typography from '../../theme/typography';
import palette from '../../theme/palette';

interface Props {
  inputValue: TextEditorValue | Descendant[];
  onChange: (value) => void;
  mentionables?: { display: string; id: string; profilePicture?: string }[];
  mediaUploads?: () => void;
  placeholder?: string;
  message?: string;
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

const PlateRichEditor = ({
  mentionables,
  inputValue,
  onChange,
  mediaUploads,
  placeholder = 'Type...',
  message,
}: Props) => {
  const customMentionables = useMemo(
    () =>
      mentionables?.map((m) => ({
        key: m.id,
        text: m.display,
        data: { img: m.profilePicture, mentionType: '@' },
      })),
    [mentionables]
  );

  const value = useMemo(() => convertSlateNodesToPlate(inputValue), [inputValue]);

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
            options: {
              trigger: '/',
            },
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
    <PlateStyles>
      <PlateProvider<TextEditorValue> plugins={plugins} onChange={onChange} value={value}>
        <Toolbar>
          <ToolbarButtons mediaUploads={mediaUploads} />
        </Toolbar>
        {message ? (
          <Typography fontFamily={typography.fontFamily} color={palette.blue20} fontWeight={500} fontSize="14px">
            {message}
          </Typography>
        ) : null}

        <Plate editableProps={editableProps}>
          <MarkBalloonToolbar />
          <MentionCombobox items={customMentionables} />
          <MentionCombobox pluginKey="/" items={slashCommandItems} />
        </Plate>
      </PlateProvider>
    </PlateStyles>
  );
};

export default PlateRichEditor;
