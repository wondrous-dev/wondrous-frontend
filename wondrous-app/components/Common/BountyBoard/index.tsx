import { useMutation } from '@apollo/client';
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
} from 'components/Common/Boards/styles';
import Compensation from 'components/Common/Compensation';
import { SafeImage } from 'components/Common/Image';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import { ToggleBoardPrivacyIcon } from 'components/Common/PrivateBoardIcon';
import { PodName, PodWrapper } from 'components/Common/Task/styles';
import TaskCardDate from 'components/Common/TaskCardDate';
import TaskCardStatus from 'components/Common/TaskCardStatuts';
import TaskPriority from 'components/Common/TaskPriority';
import { hasGR15DEIIntiative } from 'components/Common/TaskViewModal/utils';
import { CreateEntity } from 'components/CreateEntity';
import CommentsIcon from 'components/Icons/comments';
import { DAOIcon } from 'components/Icons/dao';
import PodIcon from 'components/Icons/podIcon';
import { RichTextViewer } from 'components/RichText';
import { ARCHIVE_TASK } from 'graphql/mutations';
import { SEARCH_USER_CREATED_TASKS } from 'graphql/queries';
import { useRouter } from 'next/router';
import { Fragment, useContext, useState } from 'react';
import palette from 'theme/palette';
import { PRIVACY_LEVEL } from 'utils/constants';
import { usePermissions } from 'utils/hooks';
import { SnackbarAlertContext } from '../SnackbarAlert';
import ActionModals from '../TaskViewModal/actionModals';
import { Menu } from '../TaskViewModal/helpers';
import { BountyBoardEmpty, BountyCardWrapper, MenuWrapper } from './styles';

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

const BountyItem = ({ bounty, handleCardClick, displayOrg }) => {
  const router = useRouter();
  const { canEdit, canArchive } = usePermissions(bounty);
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const hasGR15 = hasGR15DEIIntiative(bounty?.categories);
  const goToPod = (podId) => {
    router.push(`/pod/${podId}/boards`, undefined, {
      shallow: true,
    });
  };
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
  const goToOrg = (orgUsername) => router.push(`/organization/${orgUsername}/boards`, undefined, { shallow: true });

  const [anchorEl, setAnchorEl] = useState();
  const [editTask, setEditTask] = useState(false);
  const [archiveTask, setArchiveTask] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);

  const handleCloseModal = () => {
    setAnchorEl(null);
    setEditTask(false);
  };

  const [archiveTaskMutation] = useMutation(ARCHIVE_TASK, {
    refetchQueries: [
      'getTaskById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getOrgTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForPodBoard',
      SEARCH_USER_CREATED_TASKS,
    ],
    onError: () => {
      console.error('Something went wrong with archiving tasks');
    },
  });

  const handleOnCloseArchiveTaskModal = () => setArchiveTask(false);

  return (
    <>
      {editTask && (
        <CreateEntity
          open={editTask}
          handleCloseModal={() => {
            setEditTask(false);
            handleCloseModal();
          }}
          entityType={bounty?.type}
          handleClose={() => {
            setEditTask(false);
            handleCloseModal();
          }}
          cancel={() => setEditTask(false)}
          existingTask={
            bounty?.id && {
              ...bounty,
            }
          }
        />
      )}
      <ActionModals
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
        taskType={bounty?.type}
        fetchedTask={bounty}
        archiveTask={archiveTask}
        archiveTaskMutation={archiveTaskMutation}
        handleOnCloseArchiveTaskModal={handleOnCloseArchiveTaskModal}
        setSnackbarAlertOpen={setSnackbarAlertOpen}
        setSnackbarAlertMessage={setSnackbarAlertMessage}
      />
      <BountyCardWrapper onClick={() => handleCardClick(bounty)} key={bounty.id}>
        <BoardsCardHeader>
          <BoardsCardSubheader>
            <TaskCardStatus type={bounty?.type} orgId={bounty?.orgId} status={bounty?.status} />
            {hasGR15 && (
              <>
                <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
                <GR15DEILogo width="28" height="28" onClick={() => setOpenGR15Modal(true)} />
              </>
            )}
            {bounty?.privacyLevel !== PRIVACY_LEVEL.public && (
              <ToggleBoardPrivacyIcon
                style={{
                  width: '28px',
                  height: '28px',
                  marginRight: '0',
                }}
                isPrivate={bounty?.privacyLevel !== PRIVACY_LEVEL.public}
                tooltipTitle={bounty?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}
              />
            )}
          </BoardsCardSubheader>

          <Grid container width="fit-content" flexGrow="1" justifyContent="flex-end" gap="6px">
            <TaskCardDate date={bounty?.dueDate} />
            {bounty?.rewards && bounty?.rewards?.length > 0 && <Compensation rewards={bounty?.rewards} />}
          </Grid>
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
          <SubmissionsCount total={bounty.totalSubmissionsCount} approved={bounty.approvedSubmissionsCount} />
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
          <Grid item container width="fit-content" gap="12px">
            <Grid item container gap="10px" width="fit-content" lineHeight="0" alignItems="center">
              <CommentsIcon />
              {bounty.commentCount || 0}
            </Grid>
            <MenuWrapper open={Boolean(anchorEl)}>
              <Menu
                canArchive={canArchive}
                canEdit={canEdit}
                isBounty
                setArchiveTask={setArchiveTask}
                setCompleteModal={setCompleteModal}
                setEditTask={setEditTask}
                taskType={bounty?.type}
                style={{ height: '28px' }}
                setAnchorElParent={setAnchorEl}
                anchorElParent={anchorEl}
              />
            </MenuWrapper>
          </Grid>
        </BoardsCardFooter>
      </BountyCardWrapper>
    </>
  );
};

export default function Board({ tasks, handleCardClick = (bounty) => {}, displayOrg = false, Container = Fragment }) {
  return (
    <Container>
      {tasks?.length ? (
        tasks.map((bounty) => (
          <BountyItem key={bounty?.id} bounty={bounty} handleCardClick={handleCardClick} displayOrg={displayOrg} />
        ))
      ) : (
        <BountyBoardEmpty />
      )}
    </Container>
  );
}
