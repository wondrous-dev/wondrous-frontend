import { memo } from 'react';

import * as Constants from 'utils/constants';
import {
  BoardsCardSubheader,
  BoardsCardBody,
  BoardsCardHeader,
  BoardsCardBodyDescription,
  BoardsCardBodyTitle,
  BoardsPrivacyLabel,
  BoardsCardMedia,
  BoardsCardFooter,
} from 'components/Common/Boards/styles';
import { PRIVACY_LEVEL } from 'utils/constants';
import SmartLink from 'components/Common/SmartLink';
import { RichTextViewer } from 'components/RichText';
import { Approved, Rejected } from '../../Icons';
import { SafeImage } from '../Image';
import PodIcon from '../../Icons/podIcon';
import {
  ProposalCardWrapper,
  ProposalCardType,
  ProposalCardIcon,
  ProposalFooterButton,
  PodWrapper,
  PodName,
} from './styles';

const STATUS_ICONS = {
  [Constants.STATUS_APPROVED]: Approved,
  [Constants.STATUS_CLOSED]: Rejected,
};

export function TaskProposalCardMemo({
  coverMedia,
  description,
  goToPod,
  labelsAndActions,
  onNavigate,
  proposalStatus,
  task,
  title,
  viewUrl,
}) {
  const HeaderIcon = STATUS_ICONS[proposalStatus];

  return (
    <SmartLink href={viewUrl} preventLinkNavigation onNavigate={onNavigate}>
      <ProposalCardWrapper>
        <BoardsCardHeader>
          <BoardsCardSubheader>
            <ProposalCardIcon />
            <ProposalCardType>Proposal</ProposalCardType>
            <BoardsPrivacyLabel>
              {task?.privacyLevel === PRIVACY_LEVEL.public ? 'Public' : 'Members'}
            </BoardsPrivacyLabel>
          </BoardsCardSubheader>
          {HeaderIcon ? <HeaderIcon /> : null}
        </BoardsCardHeader>
        <BoardsCardBody>
          <BoardsCardBodyTitle>{title}</BoardsCardBodyTitle>
          <BoardsCardBodyDescription>
            <RichTextViewer text={description} />
          </BoardsCardBodyDescription>
          {coverMedia ? (
            <BoardsCardMedia>
              <SafeImage
                useNextImage={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                src={coverMedia.slug}
              />
            </BoardsCardMedia>
          ) : null}
          {task?.podName && (
            <PodWrapper
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPod(task?.podId);
              }}
            >
              <PodIcon
                color={task?.podColor}
                style={{
                  width: '26px',
                  height: '26px',
                  marginRight: '8px',
                }}
              />
              <PodName style={{}}>{task?.podName}</PodName>
            </PodWrapper>
          )}
        </BoardsCardBody>
        <BoardsCardFooter style={{ paddingBottom: '7px' }}>
          {labelsAndActions?.map((label, idx) => (
            <ProposalFooterButton
              isAction={!!label.action}
              onClick={(e) => {
                e.stopPropagation();
                label.action && label.action();
              }}
              borderColor={label?.borderColor}
              key={idx}
              color={label?.color}
            >
              {label?.title}
            </ProposalFooterButton>
          ))}
        </BoardsCardFooter>
      </ProposalCardWrapper>
    </SmartLink>
  );
}

TaskProposalCardMemo.displayName = 'TaskProposalCardMemo';

export default memo(TaskProposalCardMemo, (prevProps, nextProps) => {
  const areEqual =
    prevProps.coverMedia === nextProps.coverMedia &&
    prevProps.description === nextProps.description &&
    prevProps.labelsAndActions === nextProps.labelsAndActions &&
    prevProps.proposalStatus === nextProps.proposalStatus &&
    prevProps.task === nextProps.task &&
    prevProps.title === nextProps.title &&
    prevProps.viewUrl === nextProps.viewUrl;

  return areEqual;
});
