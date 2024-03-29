import Box from '@mui/material/Box';
import { useRouter } from 'next/router';

import * as Constants from 'utils/constants';
import { getProposalStatus } from 'utils/board';
import palette from 'theme/palette';

import { Approved, Rejected } from 'components/Icons';
import SmartLink from 'components/Common/SmartLink';
import {
  BoardsCardBody,
  BoardsCardBodyDescription,
  BoardsCardBodyTitle,
  BoardsCardFooter,
  BoardsCardHeader,
  BoardsCardMedia,
  BoardsCardSubheader,
  BoardsPrivacyLabel,
} from 'components/Common/Boards/styles';
import TaskPriority from 'components/Common/TaskPriority';
import { SafeImage } from 'components/Common/Image';
import PodIconName from 'components/Common/PodIconName';

import PlateRichTextViewer from 'components/PlateRichEditor/PlateRichTextViewer';
import { CardContent, ProposalCardIcon, ProposalCardType, ProposalFooterButton } from './styles';

const STATUS_ICONS = {
  [Constants.STATUS_APPROVED]: Approved,
  [Constants.STATUS_CLOSED]: Rejected,
};

export default function ProposalCard({ openModal, title, description, task, goToPod, proposalRequestChange, viewUrl }) {
  const router = useRouter();
  const coverMedia = task?.media?.find((media) => media.type === 'image');

  const proposalStatus = getProposalStatus(task);
  const PROPOSAL_STATUS_MAP = {
    [Constants.STATUS_APPROVED]: {
      labelsAndActions: [
        {
          title: 'Approved',
          borderColor: palette.green800,
          color: palette.green800,
        },
      ],
    },
    [Constants.STATUS_CLOSED]: {
      labelsAndActions: [
        {
          title: 'Rejected',
          borderColor: palette.red300,
          color: palette.red300,
        },
      ],
    },
  };
  const labelsAndActions = PROPOSAL_STATUS_MAP[proposalStatus]?.labelsAndActions;
  const HeaderIcon = STATUS_ICONS[proposalStatus];
  return (
    <CardContent>
      <SmartLink
        href={viewUrl}
        preventLinkNavigation
        onNavigate={() => {
          const query = {
            ...router.query,
            taskProposal: task.id,
          };
          router.push({ query }, undefined, { scroll: false, shallow: true });
        }}
      >
        <BoardsCardHeader>
          <BoardsCardSubheader>
            <ProposalCardIcon />
            <ProposalCardType>Proposal</ProposalCardType>
            <BoardsPrivacyLabel>Public</BoardsPrivacyLabel>
          </BoardsCardSubheader>
          {HeaderIcon ? <HeaderIcon /> : null}
        </BoardsCardHeader>
        <BoardsCardBody>
          <BoardsCardBodyTitle>{title}</BoardsCardBodyTitle>
          <Box>
            <TaskPriority value={task?.priority} />
          </Box>
          <BoardsCardBodyDescription as="div">
            <PlateRichTextViewer text={description} />
          </BoardsCardBodyDescription>
          {coverMedia ? (
            <BoardsCardMedia>
              <SafeImage
                useNextImage={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                src={coverMedia.slug}
                alt="Task cover"
              />
            </BoardsCardMedia>
          ) : null}
          {task?.podName && (
            <PodIconName
              name={task?.podName}
              color={task?.podColor}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPod(task?.podId);
              }}
            />
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
      </SmartLink>
    </CardContent>
  );
}
