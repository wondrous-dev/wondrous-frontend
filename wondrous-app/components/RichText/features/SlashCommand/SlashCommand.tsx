import React, { useCallback, useRef } from 'react';
import Portal from 'components/RichText/components/Portal';
import { useSlate } from 'slate-react';
import { Transforms } from 'slate';

import { getRangeBoundingClientRect, usePopperPosition, virtualReference } from 'components/RichText/popper';
import EditorHelpers from 'components/RichText/helpers';
import { MentionItem, MentionItemText, MentionsContainer } from './styles';
import useSlashCommands from './useSlashCommand';

const SlashCommand: React.FC<
  {
    editorContainerNode: HTMLElement;
    portalNode: HTMLElement;
    slashCommandActions: {
      name: string;
      command: string;
      action: () => void;
    }[];
  } & ReturnType<typeof useSlashCommands>['props'] &
    ReturnType<typeof useSlashCommands>['commands']
> = ({
  editorContainerNode,
  portalNode,
  slashCommandActions,
  slashCommandTarget,
  mentionSearch,
  activeSlashCommandIndex,
  setSlashCommandTarget,
}) => {
  const editor = useSlate();

  const slashCommandContainerRef = useRef<HTMLDivElement>(null);
  const slashCommandPortalNodeRef = useRef<HTMLDivElement>();

  const foundActions = slashCommandActions
    .filter((m) => m.command?.toLowerCase().startsWith(mentionSearch.toLowerCase()))
    .slice(0, 10);

  const getBoundingClientRect = useCallback(
    () => getRangeBoundingClientRect(editor, slashCommandTarget) ?? virtualReference,
    [editor, slashCommandTarget]
  );

  const { styles: popperStyles, attributes } = usePopperPosition({
    popperElement: slashCommandContainerRef.current,
    // this container node is essential to make mentions popper work in modals
    popperContainer: editorContainerNode,
    placement: 'bottom-start',
    getBoundingClientRect,
    offset: [0, 4],
  });

  const isSlashCommandComboboxShown = Boolean(foundActions.length && slashCommandTarget);

  return (
    <>
      <Portal node={portalNode || slashCommandPortalNodeRef.current}>
        <MentionsContainer
          shown={isSlashCommandComboboxShown}
          ref={slashCommandContainerRef}
          style={popperStyles.popper}
          {...attributes.popper}
        >
          {foundActions.map(({ command, name, action }, i) => (
            <MentionItem
              key={command}
              active={i === activeSlashCommandIndex}
              onClick={() => {
                Transforms.select(editor, slashCommandTarget);
                // action();
                EditorHelpers.insertSlashCommand(editor, foundActions[i].command, foundActions[i].action());
                setSlashCommandTarget(null);
              }}
            >
              <MentionItemText>{name}</MentionItemText>
            </MentionItem>
          ))}
        </MentionsContainer>
      </Portal>
      <div ref={slashCommandPortalNodeRef} />
    </>
  );
};

export default SlashCommand;
