import { Fragment, useState } from 'react';
import {
  BoardsCardSubheader,
  BoardsCardHeader,
  BoardsCardBody,
  BoardsRewardLabel,
  BoardsPrivacyLabel,
  BoardsCardFooter,
  BoardsCardBodyTitle,
  BoardsCardBodyDescription,
  BoardsCardMedia,
} from 'components/Common/Boards/styles';
import { PRIVACY_LEVEL, TASK_STATUS_DONE, TASK_STATUS_TODO } from 'utils/constants';
import CommentsIcon from 'components/Icons/comments';
import { SafeImage } from 'components/Common/Image';
import { SubtaskDarkIcon } from 'components/Icons/subtask';
import { PodName, PodWrapper } from 'components/Common/Task/styles';
import PodIcon from 'components/Icons/podIcon';
import { useRouter } from 'next/router';
import TASK_ICONS from 'components/Common/Task/constants';
import { CompletedIcon } from 'components/Icons/statusIcons';
import { RichTextViewer } from 'components/RichText';
import { DAOIcon } from 'components/Icons/dao';
import EmptyStateBoards from 'components/EmptyStateBoards';
import { Compensation } from '../Compensation';
import {
  BountyCardWrapper,
  BountyIcon,
  BountyCardType,
  BountyCardSubmissionsCountWrapper,
  BountyCardSubmissionsCount,
  SubmissionCount,
  SubtasksWrapper,
  BountyCommentsIcon,
} from './styles';
import GR15DEIModal from '../IntiativesModal/GR15DEIModal';
import { hasGR15DEIIntiative } from '../TaskViewModal/utils';
import { GR15DEILogo } from '../IntiativesModal/GR15DEIModal/GR15DEILogo';

export function SubmissionsCount({ total, approved }) {
  const config = [
    {
      label: 'submissions',
      count: total,
      gradient: 'blue',
    },
    {
      label: 'approved',
      count: approved,
      gradient: 'green',
    },
  ];

  return (
    <BountyCardSubmissionsCountWrapper>
      {config.map((item, idx) => (
        <BountyCardSubmissionsCount key={idx}>
          <SubmissionCount gradient={item.gradient}>{item.count || 0}</SubmissionCount>
          {item.label}
        </BountyCardSubmissionsCount>
      ))}
    </BountyCardSubmissionsCountWrapper>
  );
}
export default function Board({ tasks, handleCardClick = (bounty) => {}, displayOrg = false, Container = Fragment }) {
  const router = useRouter();
  const goToPod = (podId) => {
    router.push(`/pod/${podId}/boards`, undefined, {
      shallow: true,
    });
  };
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
  const goToOrg = (orgUsername) => router.push(`/organization/${orgUsername}/boards`, undefined, { shallow: true });

  return (
    <Container>
      {tasks?.length ? (
        tasks.map((bounty) => {
          const BountyStatusIcon = TASK_ICONS[bounty?.status];

          const hasGR15 = hasGR15DEIIntiative(bounty?.categories);
          return (
            <BountyCardWrapper onClick={() => handleCardClick(bounty)} key={bounty.id}>
              <BoardsCardHeader>
                <BoardsCardSubheader>
                  <BountyIcon />
                  {hasGR15 && (
                    <>
                      <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
                      <GR15DEILogo
                        style={{
                          marginLeft: '-8px',
                        }}
                        width="28"
                        height="28"
                        onClick={() => setOpenGR15Modal(true)}
                      />
                    </>
                  )}
                  <BountyCardType>{bounty?.type || ''}</BountyCardType>
                  <BoardsPrivacyLabel>
                    {bounty?.privacyLevel === PRIVACY_LEVEL.public ? 'Public' : 'Members'}
                  </BoardsPrivacyLabel>
                </BoardsCardSubheader>
                {bounty?.status === TASK_STATUS_DONE && !bounty?.rewards && <CompletedIcon />}
                {bounty?.rewards && bounty?.rewards?.length > 0 && (
                  <BoardsRewardLabel>
                    <Compensation rewards={bounty?.rewards} taskIcon={<BountyStatusIcon />} />
                  </BoardsRewardLabel>
                )}
              </BoardsCardHeader>
              <BoardsCardBody>
                <BoardsCardBodyTitle>{bounty.title}</BoardsCardBodyTitle>
                <BoardsCardBodyDescription>
                  <RichTextViewer text={bounty.description} />
                </BoardsCardBodyDescription>
                {bounty?.media?.[0] ? (
                  <BoardsCardMedia>
                    <SafeImage
                      useNextImage={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                      src={bounty?.media[0].slug}
                    />
                  </BoardsCardMedia>
                ) : null}
                <SubmissionsCount total={bounty.totalSubmissionsCount} approved={bounty.approvedSubmissionsCount} />
              </BoardsCardBody>
              <BoardsCardFooter>
                {bounty?.podName && !displayOrg && (
                  <PodWrapper
                    style={{ marginTop: '0' }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToPod(bounty?.podId);
                    }}
                  >
                    <PodIcon
                      color={bounty?.podColor}
                      style={{
                        width: '26px',
                        height: '26px',
                        marginRight: '8px',
                      }}
                    />
                    <PodName>{bounty?.podName}</PodName>
                  </PodWrapper>
                )}
                {displayOrg && (
                  <PodWrapper
                    style={{ marginTop: '0', alignItems: 'center' }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToOrg(bounty?.orgUsername);
                    }}
                  >
                    {bounty?.orgProfilePicture ? (
                      <SafeImage
                        src={bounty.orgProfilePicture}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '4px',
                          marginRight: '8px',
                        }}
                      />
                    ) : (
                      <DAOIcon />
                    )}

                    <PodName>{bounty?.orgName}</PodName>
                  </PodWrapper>
                )}
                <div
                  style={{
                    flex: 1,
                  }}
                />

                {Number.isInteger(bounty.totalSubtaskCount) && (
                  <SubtasksWrapper>
                    <SubtaskDarkIcon height="30" width="30" fill="transparent" />
                    {bounty.totalSubtaskCount}
                  </SubtasksWrapper>
                )}
                <BountyCommentsIcon>
                  <CommentsIcon />
                  {bounty.commentCount || 0}
                </BountyCommentsIcon>
              </BoardsCardFooter>
            </BountyCardWrapper>
          );
        })
      ) : (
        <EmptyStateBoards hidePlaceholder status={TASK_STATUS_TODO} fullWidth />
      )}
    </Container>
  );
}
