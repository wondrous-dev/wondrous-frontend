import React, { CSSProperties, useMemo, useState } from 'react';
import { PlateStyles } from 'components/PlateRichEditor/styles';
import { convertSlateNodesToPlate } from 'components/PlateRichEditor/utils';
import {
  AutoformatPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodePlugin,
  createComboboxPlugin,
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
import Typography from '@mui/material/Typography';

import typography from 'theme/typography';
import palette from 'theme/palette';
import { createCustomMentionPlugin } from 'components/PlateRichEditor/customPlugins/CustomMention/createMentionPlugin';
import { slashCommandItems } from 'components/PlateRichEditor/constants';
import { ToolbarButtons } from 'components/PlateRichEditor/ToolbarButtons';
import { MarkBalloonToolbar } from 'components/PlateRichEditor/plugins/balloonToolbar/MarkBalloonToolbar';
import { autoformatPlugin } from 'components/PlateRichEditor/plugins/autoformat/autoformatPlugin';
import { MentionCombobox, MentionElement } from 'components/PlateRichEditor/customPlugins/Mention';
import { exitBreakPlugin } from './plugins/exitBreakPlugin';
import { resetBlockTypePlugin } from './plugins/resetBlockTypePlugin';
import { softBreakPlugin } from './plugins/softBreakPlugin';
import { Toolbar } from './plugins/Toolbar';
import { createMyPlugins, ElementTypes, CustomEditor, TextEditorValue } from './types';
import { linkPlugin } from './plugins/linkPlugin';

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
  // State to keep track of the conversion status of nodes
  const [isNodeConversionCompleted, setNodeConversionCompleted] = useState<boolean>(false);
  const customMentionables = useMemo(
    () =>
      mentionables?.map((m) => ({
        key: m.id,
        text: m.display,
        data: { img: m.profilePicture, mentionType: '@' },
      })),
    [mentionables]
  );

  const value = useMemo(
    () => (isNodeConversionCompleted ? inputValue : convertSlateNodesToPlate(inputValue)),
    [inputValue, isNodeConversionCompleted]
  );

  const editableProps: TEditableProps<TextEditorValue> = {
    spellCheck: false,
    autoFocus: false,
    placeholder,
  };

  const handleChange = (nodes) => {
    if (!isNodeConversionCompleted) {
      setNodeConversionCompleted(true);
    }

    if (nodes[nodes.length - 1]?.type === ElementTypes.ELEMENT_BLOCKQUOTE) {
      nodes.push({
        type: 'p',
        children: [{ text: '' }],
      });
    }

    onChange(nodes);
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
          // temporary disable emoji plugin due to this issue
          // https://github.com/udecode/plate/issues/2138
          // this fix doesn't work https://github.com/udecode/plate/commit/54297ef798c392bdfaa142a97dbad0fcc5fd5d94#diff-3e728fa028e44b1e4817b3bb10e775038344609e2d383663751de04ac415ffcb
          // createEmojiPlugin(emojiPlugin),
        ],
        {
          components,
        }
      ),
    []
  );

  return (
    <PlateStyles>
      <PlateProvider<TextEditorValue> plugins={plugins} onChange={handleChange} value={value}>
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
