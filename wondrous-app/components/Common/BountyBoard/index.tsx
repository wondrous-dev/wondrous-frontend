import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  BoardsCardBody,
  BoardsCardBodyDescription,
  BoardsCardBodyTitle,
  BoardsCardFooter,
  BoardsCardHeader,
  BoardsCardMedia,
  BoardsCardSubheader,
  BoardsRewardLabel,
} from 'components/Common/Boards/styles';
import { Compensation } from 'components/Common/Compensation';
import { SafeImage } from 'components/Common/Image';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import { ToggleBoardPrivacyIcon } from 'components/Common/PrivateBoardIcon';
import TASK_ICONS from 'components/Common/Task/constants';
import { PodName, PodWrapper } from 'components/Common/Task/styles';
import TaskPriority from 'components/Common/TaskPriority';
import { hasGR15DEIIntiative } from 'components/Common/TaskViewModal/utils';
import CommentsIcon from 'components/Icons/comments';
import { DAOIcon } from 'components/Icons/dao';
import PodIcon from 'components/Icons/podIcon';
import { SubtaskDarkIcon } from 'components/Icons/subtask';
import { RichTextViewer } from 'components/RichText';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import palette from 'theme/palette';
import { getFilterSchema } from 'utils/board';
import { BOUNTY_TYPE, PRIVACY_LEVEL } from 'utils/constants';
import { BountyBoardEmpty, BountyCardWrapper, BountyCommentsIcon, SubtasksWrapper } from './styles';

const getStatus = ({ entityType, orgId, bountyStatus }) => {
  const entityTypeFilters = getFilterSchema(entityType, orgId);
  const statuses = entityTypeFilters?.find(({ name }) => name === 'statuses')?.items;
  const status = statuses?.find(({ id }) => id === bountyStatus);
  return status;
};

export function SubmissionsCount({ total, approved }) {
  const config = [
    {
      label: 'Submissions',
      count: total,
      color: palette.highlightBlue,
    },
    {
      label: 'Approved',
      count: approved,
      color: palette.green30,
    },
  ];

  return (
    <Grid container justifyContent="space-between" alignItems="center" gap="14px">
      {config.map(({ label, count, color }) => (
        <Grid
          item
          container
          maxWidth="calc(50% - 7px)"
          borderRadius="6px"
          fontFamily="Space Grotesk"
          gap="10px"
          key={label}
          alignItems="center"
          height="32px"
          padding="7px 10px"
          lineHeight="0"
          bgcolor={palette.background.default}
        >
          <Typography color={color} fontWeight="700" fontSize="18px" lineHeight="0">
            {count || 0}
          </Typography>
          <Typography color={palette.white} fontWeight="500" fontSize="12px" lineHeight="0">
            {label}
          </Typography>
        </Grid>
      ))}
    </Grid>
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
          const status = getStatus({ entityType: bounty?.type, orgId: bounty?.orgId, bountyStatus: bounty?.status });
          return (
            <BountyCardWrapper onClick={() => handleCardClick(bounty)} key={bounty.id}>
              <BoardsCardHeader>
                <BoardsCardSubheader>
                  <Grid
                    container
                    bgcolor={palette.grey99}
                    padding="2px 10px 2px 2px"
                    borderRadius="300px"
                    fontSize="14px"
                    fontWeight="500"
                    gap="6px"
                  >
                    {status?.icon}
                    {status?.label}
                  </Grid>
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
                  {bounty?.privacyLevel !== PRIVACY_LEVEL.public && (
                    <ToggleBoardPrivacyIcon
                      style={{
                        width: '29px',
                        height: '29px',
                        marginRight: '0',
                      }}
                      isPrivate={bounty?.privacyLevel !== PRIVACY_LEVEL.public}
                      tooltipTitle={bounty?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}
                    />
                  )}
                </BoardsCardSubheader>
                {bounty?.rewards && bounty?.rewards?.length > 0 && (
                  <BoardsRewardLabel>
                    <Compensation rewards={bounty?.rewards} taskIcon={<BountyStatusIcon />} />
                  </BoardsRewardLabel>
                )}
              </BoardsCardHeader>
              <BoardsCardBody>
                <BoardsCardBodyTitle>{bounty.title}</BoardsCardBodyTitle>
                {bounty?.priority ? (
                  <Box>
                    <TaskPriority value={bounty?.priority} />
                  </Box>
                ) : null}
                <BoardsCardBodyDescription>
                  <RichTextViewer text={bounty.description} />
                </BoardsCardBodyDescription>
                {bounty?.type === BOUNTY_TYPE && (
                  <SubmissionsCount total={bounty.totalSubmissionsCount} approved={bounty.approvedSubmissionsCount} />
                )}
                {bounty?.media?.[0] && bounty?.media?.[0]?.type === 'image' ? (
                  <BoardsCardMedia>
                    <SafeImage
                      useNextImage={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        borderRadius: '6px',
                      }}
                      src={bounty?.media[0].slug}
                    />
                  </BoardsCardMedia>
                ) : null}
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
                      color={bounty?.podColor || palette.grey900}
                      style={{
                        width: '26px',
                        height: '26px',
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
        <BountyBoardEmpty />
      )}
    </Container>
  );
}
