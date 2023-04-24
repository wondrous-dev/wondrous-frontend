import { useMutation } from '@apollo/client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {
  BoardsCardBody,
  BoardsCardBodyDescription,
  BoardsCardBodyTitle,
  BoardsCardFooter,
  BoardsCardHeader,
  BoardsCardMedia,
  BoardsCardSubheader,
} from 'components/Common/Boards/styles';
import { SafeImage } from 'components/Common/Image';
import { MilestoneProgress } from 'components/Common/MilestoneProgress';
import PodIconName from 'components/Common/PodIconName';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import TaskCardDate from 'components/Common/TaskCardDate';
import TaskCardMenu from 'components/Common/TaskCardMenu';
import TaskCardPrivacy from 'components/Common/TaskCardPrivacy';
import TaskCardStatus from 'components/Common/TaskCardStatus';
import TaskPriority from 'components/Common/TaskPriority';
import ActionModals from 'components/Common/TaskViewModal/ActionModalsComponent';
import { CreateEntity } from 'components/CreateEntity';
import EmptyStateBoards from 'components/EmptyStateBoards';
import CommentsIcon from 'components/Icons/comments';
import PodIcon from 'components/Icons/podIcon';
import PlateRichTextViewer from 'components/PlateRichEditor/PlateRichTextViewer';
import { ARCHIVE_TASK, ARCHIVE_MILESTONE } from 'graphql/mutations';
import { SEARCH_USER_CREATED_TASKS } from 'graphql/queries';
import { useRouter } from 'next/router';
import { Fragment, useContext, useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { usePermissions, usePodBoard } from 'utils/hooks';
import DeleteMilestoneConfirm from '../DeleteMilestoneConfirm';
import DisplayCrossPods from '../DisplayCrossPods';
import { MilestoneCard, MilestoneProgressWrapper } from './styles';

const MilestoneItem = ({ milestone, handleCardClick }) => {
  const router = useRouter();
  const podBoard = usePodBoard();
  const podId = podBoard?.podId;
  // TODO @Adrian: avoid spreading milestone, this is really just a hotfix for now
  const { canEdit, canArchive, canDelete } = usePermissions(
    {
      podId,
      ...milestone,
    },
    true
  );
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

  const [archiveMilestoneMutation] = useMutation(ARCHIVE_MILESTONE, {
    refetchQueries: [
      'getMilestoneById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
      'getOrgBoardMilestones',
      'getPodBoardMilestones',
    ],
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
          entityType={ENTITIES_TYPES.MILESTONE}
          handleClose={() => {
            setEditTask(false);
            handleCloseModal();
          }}
          cancel={() => setEditTask(false)}
          existingTask={
            milestone?.id && {
              ...milestone,
              // TODO: normalize pods
              podIds: milestone?.pods?.map((pod) => pod.podId || pod.id),
            }
          }
        />
      )}
      <ActionModals
        archiveTask={archiveTask}
        archiveTaskMutation={({ variables }) =>
          archiveMilestoneMutation({ variables: { milestoneId: variables.taskId } })
        }
        completeModal={completeModal}
        fetchedTask={milestone}
        isMilestone
        handleOnCloseArchiveTaskModal={handleOnCloseArchiveTaskModal}
        setCompleteModal={setCompleteModal}
        setSnackbarAlertMessage={setSnackbarAlertMessage}
        setSnackbarAlertOpen={setSnackbarAlertOpen}
        taskType={milestone?.type}
        setDeleteTask={setDeleteTask}
        deleteTask={deleteTask && (!milestone?.pods || milestone?.pods?.length <= 1)}
      />
      <DeleteMilestoneConfirm
        milestone={milestone}
        onClose={() => setDeleteTask(false)}
        isOpen={deleteTask && milestone?.pods?.length > 1}
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
            <TaskCardStatus type={ENTITIES_TYPES.MILESTONE} orgId={milestone?.orgId} status={milestone?.status} />
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
          <BoardsCardBodyDescription as="div">
            <PlateRichTextViewer text={milestone.description} />
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
                alt="Milestone image"
              />
            </BoardsCardMedia>
          ) : null}
        </BoardsCardBody>
        <BoardsCardFooter>
          <DisplayCrossPods pods={milestone.pods} />
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
