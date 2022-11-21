import { useCallback, useRef, useState } from 'react';
import { SafeImage } from 'components/Common/Image';
import Portal from 'components/RichText/components/Portal';

import { useSlate } from 'slate-react';
import { Range, Transforms } from 'slate';
import EditorHelpers from 'components/RichText/helpers';
import { getRangeBoundingClientRect, usePopperPosition, virtualReference } from 'components/RichText/popper';
import { MentionItem, MentionItemText, MentionsContainer } from './styles';
import useMentions from './useMentions';

const Mentions: React.FC<
  {
    editorContainerNode: HTMLElement;
    portalNode?: HTMLElement;
  } & ReturnType<typeof useMentions>['props'] &
    ReturnType<typeof useMentions>['commands']
> = ({
  editorContainerNode,
  portalNode,
  mentionables,
  mentionTarget,
  mentionSearch,
  activeMentionIndex,
  setMentionTarget,
}) => {
  const editor = useSlate();

  const mentionsContainerRef = useRef<HTMLDivElement>(null);
  const mentionsPortalNodeRef = useRef<HTMLDivElement>();

  const foundMentionables = mentionables
    .filter((m) => m.display?.toLowerCase().startsWith(mentionSearch.toLowerCase()))
    .slice(0, 10);

  const getBoundingClientRect = useCallback(
    () => getRangeBoundingClientRect(editor, mentionTarget) ?? virtualReference,
    [editor, mentionTarget]
  );

  const { styles: popperStyles, attributes } = usePopperPosition({
    popperElement: mentionsContainerRef.current,
    // this container node is essential to make mentions popper work in modals
    popperContainer: editorContainerNode,
    placement: 'bottom-start',
    getBoundingClientRect,
    offset: [0, 4],
  });

  const isMentionsComboboxShown = Boolean(foundMentionables.length && mentionTarget);

  return (
    <>
      <Portal node={portalNode || mentionsPortalNodeRef.current}>
        <MentionsContainer
          shown={isMentionsComboboxShown}
          ref={mentionsContainerRef}
          style={popperStyles.popper}
          {...attributes.popper}
        >
          {foundMentionables.map(({ id, display, profilePicture }, i) => (
            <MentionItem
              key={id}
              active={i === activeMentionIndex}
              onClick={() => {
                Transforms.select(editor, mentionTarget);
                EditorHelpers.insertMention(editor, foundMentionables[i].display, foundMentionables[i].id);
                setMentionTarget(null);
              }}
            >
              <SafeImage
                useNextImage={false}
                src={profilePicture}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '15px',
                }}
                alt="Profile picture"
              />
              <MentionItemText>{display}</MentionItemText>
            </MentionItem>
          ))}
        </MentionsContainer>
      </Portal>
      <div ref={mentionsPortalNodeRef} />
    </>
  );
};

export default Mentions;
