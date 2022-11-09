import { Fragment, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import CommentsIcon from 'components/Icons/comments';
import { PRIVACY_LEVEL, TASK_STATUS_DONE } from 'utils/constants';
import { MilestoneProgress } from 'components/Common/MilestoneProgress';
import {
  BoardsCardSubheader,
  BoardsCardBody,
  BoardsPrivacyLabel,
  BoardsCardFooter,
  BoardsCardHeader,
  BoardsCardBodyDescription,
  BoardsCardBodyTitle,
  BoardsCardMedia,
} from 'components/Common/Boards/styles';
import { PodName, PodWrapper } from 'components/Common/Task/styles';
import PodIcon from 'components/Icons/podIcon';
import { useRouter } from 'next/router';
import { RichTextViewer } from 'components/RichText';
import EmptyStateBoards from 'components/EmptyStateBoards';
import TaskPriority from 'components/Common/TaskPriority';
import TaskCardDate from 'components/Common/TaskCardDate';
import TaskCardStatus from 'components/Common/TaskCardStatuts';
import TaskCardPrivacy from 'components/Common/TaskCardPrivacy';
import { usePermissions } from 'utils/hooks';
import { CreateEntity } from 'components/CreateEntity';
import { useMutation } from '@apollo/client';
import { SEARCH_USER_CREATED_TASKS } from 'graphql/queries';
import { ARCHIVE_TASK } from 'graphql/mutations';
import { SafeImage } from '../Image';
import { MilestoneCard, MilestoneProgressWrapper } from './styles';
import ActionModals from '../TaskViewModal/actionModals';
import { SnackbarAlertContext } from '../SnackbarAlert';
import TaskCardMenu from '../TaskCardMenu';

const MilestoneItem = ({ milestone, handleCardClick }) => {
  const router = useRouter();
  const { canEdit, canArchive, canDelete } = usePermissions(milestone);
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [archiveTask, setArchiveTask] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const coverMedia = milestone?.media?.find((media) => media.type === 'image');
  const handleCloseModal = () => {
    setAnchorEl(null);
    setEditTask(false);
  };
  const goToPod = (podId) => {
    router.push(`/pod/${podId}/boards`, undefined, {
      shallow: true,
    });
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
          entityType={milestone?.type}
          handleClose={() => {
            setEditTask(false);
            handleCloseModal();
          }}
          cancel={() => setEditTask(false)}
          existingTask={
            milestone?.id && {
              ...milestone,
            }
          }
        />
      )}
      <ActionModals
        archiveTask={archiveTask}
        archiveTaskMutation={archiveTaskMutation}
        completeModal={completeModal}
        deleteTask={deleteTask}
        fetchedTask={milestone}
        handleOnCloseArchiveTaskModal={handleOnCloseArchiveTaskModal}
        setCompleteModal={setCompleteModal}
        setDeleteTask={setDeleteTask}
        setSnackbarAlertMessage={setSnackbarAlertMessage}
        setSnackbarAlertOpen={setSnackbarAlertOpen}
        taskType={milestone?.type}
      />
      <MilestoneCard
        onClick={() => handleCardClick(milestone)}
        key={milestone.id}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => {
          setShowMenu(false);
          setAnchorEl(null);
        }}
      >
        <BoardsCardHeader>
          <BoardsCardSubheader>
            <TaskCardStatus type={milestone?.type} orgId={milestone?.orgId} status={milestone?.status} />
            <TaskCardPrivacy privacyLevel={milestone?.privacyLevel} />
          </BoardsCardSubheader>
          <Grid container width="fit-content" flexGrow="1" justifyContent="flex-end">
            <TaskCardDate date={milestone?.dueDate} />
          </Grid>
        </BoardsCardHeader>
        <BoardsCardBody>
          <BoardsCardBodyTitle>{milestone.title}</BoardsCardBodyTitle>
          {milestone?.priority ? (
            <Box>
              <TaskPriority value={milestone?.priority} />
            </Box>
          ) : null}
          <BoardsCardBodyDescription>
            <RichTextViewer text={milestone.description} />
          </BoardsCardBodyDescription>
          <MilestoneProgressWrapper>
            <MilestoneProgress milestoneId={milestone.id} />
          </MilestoneProgressWrapper>
          {coverMedia ? (
            <BoardsCardMedia>
              <SafeImage
                useNextImage={false}
                style={{ height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'center' }}
                src={coverMedia.slug}
              />
            </BoardsCardMedia>
          ) : null}
        </BoardsCardBody>
        <BoardsCardFooter>
          {milestone?.podName && (
            <PodWrapper
              style={{ marginTop: 0 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPod(milestone?.podId);
              }}
            >
              <PodIcon
                color={milestone?.podColor}
                style={{
                  width: '26px',
                  height: '26px',
                  marginRight: '8px',
                }}
              />
              <PodName>{milestone?.podName}</PodName>
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
              {milestone.commentCount || 0}
            </Grid>
            <TaskCardMenu
              anchorElParent={anchorEl}
              canArchive={canArchive}
              canEdit={canEdit}
              canDelete={canDelete}
              setAnchorElParent={setAnchorEl}
              setArchiveTask={setArchiveTask}
              setCompleteModal={setCompleteModal}
              setDeleteTask={setDeleteTask}
              setEditTask={setEditTask}
              taskType={milestone?.type}
              open={showMenu}
            />
          </Grid>
        </BoardsCardFooter>
      </MilestoneCard>
    </>
  );
};

export default function Board({ tasks, handleCardClick, Container = Fragment }) {
  return (
    <Container>
      {tasks?.length ? (
        tasks.map((milestone) => <MilestoneItem milestone={milestone} handleCardClick={handleCardClick} />)
      ) : (
        <EmptyStateBoards hidePlaceholder status="created" fullWidth />
      )}
    </Container>
  );
}
