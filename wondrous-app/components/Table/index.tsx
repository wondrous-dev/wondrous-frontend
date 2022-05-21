import { useApolloClient, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { UPDATE_TASK_STATUS, ARCHIVE_TASK } from 'graphql/mutations';
import { GET_TASK_REVIEWERS } from 'graphql/queries';
import { ViewType } from 'types/common';
import { delQuery } from 'utils';
import * as Constants from 'utils/constants';
import {
  ENTITIES_TYPES,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_SUBMISSION_REQUEST,
} from 'utils/constants';
import { useColumns } from 'utils/hooks';
import { useLocation } from 'utils/useLocation';
import { ArchiveTaskModal } from '../Common/ArchiveTaskModal';
import { LoadMore } from '../Common/KanbanBoard/styles';
import { KudosForm } from '../Common/KudosForm';
import { SnackbarAlertContext } from '../Common/SnackbarAlert';
import { TaskViewModal } from '../Common/Task/modal';
import { ArchivedTaskUndo } from '../Common/Task/styles';
import EditLayoutBaseModal from '../CreateEntity/editEntityModal';
import { CreateModalOverlay } from '../CreateEntity/styles';
import { DropDownButtonDecision } from '../DropDownDecision/DropDownButton';
import { Claim } from '../Icons/claimTask';
import ImageIcon from '../Icons/image';
import AudioIcon from '../Icons/MediaTypesIcons/audio';
import PlayIcon from '../Icons/play';
import { TaskMenuIcon } from '../Icons/taskMenu';
import TaskStatus from '../Icons/TaskStatus';
import {
  Box,
  Initials,
  MoreOptions,
  Reward,
  RewardAmount,
  RewardContainer,
  StyledLinkIcon,
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
  TaskDescription,
  TaskTitle,
} from './styles';
import { Red800 } from 'theme/colors';
import { DeleteTaskModal } from 'components/Common/DeleteTaskModal';

const DELIVERABLES_ICONS = {
  audio: <AudioIcon />,
  image: <ImageIcon />,
  link: <StyledLinkIcon />,
  video: <PlayIcon />,
};
import TableBody from './TableBody';

const createTasksFromColumns = (columns) => {
  return columns.reduce((acc, column) => {
    acc = [...acc, ...column.tasks];
    if (column?.section?.tasks) {
      acc = [...acc, ...column?.section?.tasks];
    }
    return acc;
  }, []);
};

export const Table = (props) => {
  const { columns, onLoadMore, hasMore, allTasks, limit, isAdmin, tasks } = props;
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [editableTask, setEditableTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [isArchiveModalOpen, setArchiveModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isKudosModalOpen, setKudosModalOpen] = useState(false);
  const [kudosTask, setKudosTask] = useState(null);
  const [ref, inView] = useInView({});
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const boardColumns = useColumns();
  const location = useLocation();

  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore]);

  const [updateTaskStatusMutation] = useMutation(UPDATE_TASK_STATUS);

  async function editTask(task, status = '') {
    let populatedTask = { ...task };
    const isTaskProposal =
      status === Constants.TASK_STATUS_REQUESTED ||
      status === Constants.TASK_STATUS_PROPOSAL_REQUEST ||
      task.isProposal;

    if (!isTaskProposal) {
      const isTaskSubmission =
        status === Constants.TASK_STATUS_IN_REVIEW || status === Constants.TASK_STATUS_SUBMISSION_REQUEST;
      const {
        data: { getTaskReviewers },
      } = await apolloClient.query({
        query: GET_TASK_REVIEWERS,
        variables: {
          taskId: !isTaskSubmission ? task?.id : task?.taskId,
        },
      });

      populatedTask.reviewers = getTaskReviewers || [];
    }

    setEditableTask(populatedTask);
  }

  async function handleNewStatus(task, status) {
    updateTaskStatusMutation({
      variables: {
        taskId: task?.taskId ?? task?.id,
        input: {
          newStatus: status,
        },
      },
    });
  }
  async function archiveTask(task) {
    const newColumns = [...boardColumns.columns];
    const column = newColumns.find((column) => column.tasks.includes(task));
    let taskIndex;

    await apolloClient.mutate({
      mutation: ARCHIVE_TASK,
      variables: {
        taskId: task?.taskId ?? task?.id,
      },
      refetchQueries: () => [
        'getSubmissionsUserCanReview',
        'getWorkFlowBoardReviewableItemsCount',
        'getUserTaskBoardTasks',
      ],
    });

    if (column) {
      taskIndex = column.tasks.indexOf(selectedTask);
      column.tasks.splice(taskIndex, 1);
      boardColumns?.setColumns(newColumns);
    }

    setSnackbarAlertOpen(true);
    setSnackbarAlertMessage(
      <>
        Task archived successfully!{' '}
        <ArchivedTaskUndo
          onClick={() => {
            handleNewStatus(selectedTask, selectedTask.status);
            setSnackbarAlertOpen(false);
            setSelectedTask(null);

            if (taskIndex > -1) {
              column.tasks.splice(taskIndex, 0, task);
              boardColumns?.setColumns([...newColumns]);
            }
          }}
        >
          Undo
        </ArchivedTaskUndo>
      </>
    );
  }

  function openTask(task, status = '') {
    const view = location.params.view ?? ViewType.List;
    if (status === TASK_STATUS_REQUESTED || status === TASK_STATUS_PROPOSAL_REQUEST || task?.isProposal) {
      location.replace(`${delQuery(router.asPath)}?taskProposal=${task?.id}&view=${view}`);
    } else if (status === TASK_STATUS_IN_REVIEW || status === TASK_STATUS_SUBMISSION_REQUEST) {
      location.replace(`${delQuery(router.asPath)}?task=${task?.taskId}&view=${view}`);
    } else {
      location.replace(`${delQuery(router.asPath)}?task=${task?.id}&view=${view}`);
    }
  }

  const taskType = (selectedTask) => {
    const typeName = selectedTask?.__typename;
    const taskType = {
      TaskProposalCard: 'task proposal',
      TaskSubmissionCard: 'task',
    };
    return taskType[typeName] ?? selectedTask?.type;
  };

  const handleKudosFormOnClose = () => {
    setKudosModalOpen(false);
    setKudosTask(null);
  };

  useEffect(() => {
    if (
      (location.params.task || location.params.taskProposal) &&
      (location.params.view == ViewType.List || location.params.view == ViewType.Admin)
    ) {
      setPreviewModalOpen(true);
    } else {
      setPreviewModalOpen(false);
    }
  }, [location.params.task, location.params.taskProposal, location.params.view]);

  const tableTasks = tasks || createTasksFromColumns(columns);

  return (
    <>
      <TaskViewModal
        open={isPreviewModalOpen}
        handleClose={() => {
          location.replace(`${delQuery(router.asPath)}?view=${location.params.view ?? ViewType.Grid}`);
        }}
        isTaskProposal={!!location.params.taskProposal}
        taskId={(location.params.taskProposal ?? location.params.task)?.toString()}
      />
      {isArchiveModalOpen && selectedTask?.id ? (
        <ArchiveTaskModal
          taskId={selectedTask?.id}
          open={isArchiveModalOpen}
          taskType={taskType(selectedTask)}
          onClose={() => setArchiveModalOpen(false)}
          onArchive={() => archiveTask(selectedTask)}
        />
      ) : null}
      {isDeleteModalOpen && selectedTask?.id ? (
        <DeleteTaskModal
          taskId={selectedTask?.id}
          open={isDeleteModalOpen}
          taskType={taskType(selectedTask)}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={() => {
            setSnackbarAlertMessage('Deleted successfully!');
            setSnackbarAlertOpen(true);
          }}
        />
      ) : null}
      {editableTask ? (
        <CreateModalOverlay
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          open={open}
          onClose={() => {
            setEditableTask(false);
          }}
        >
          <EditLayoutBaseModal
            open={open}
            entityType={editableTask?.isProposal ? ENTITIES_TYPES.PROPOSAL : editableTask?.type || ENTITIES_TYPES.TASK}
            handleClose={() => setEditableTask(false)}
            cancelEdit={() => setEditableTask(false)}
            existingTask={editableTask}
            isTaskProposal={editableTask.type === Constants.TASK_STATUS_REQUESTED}
          />
        </CreateModalOverlay>
      ) : null}
      <KudosForm onClose={handleKudosFormOnClose} open={isKudosModalOpen} submission={kudosTask} />

      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableCell align="center" width="56px">
                DAO
              </StyledTableCell>
              <StyledTableCell align="center" width="105px">
                {isAdmin ? 'Created by' : 'Assigned'}
              </StyledTableCell>
              <StyledTableCell align="center" width="77px">
                Status
              </StyledTableCell>
              <StyledTableCell width="383px">Task</StyledTableCell>
              {/*<StyledTableCell width="190px">Deliverables</StyledTableCell>*/}
              <StyledTableCell align="center" width="88px">
                Reward
              </StyledTableCell>
              {isAdmin && (
                <StyledTableCell align="center" width="80px">
                  Decision
                </StyledTableCell>
              )}
              <StyledTableCell width="54px"></StyledTableCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody
            limit={limit}
            openTask={openTask}
            isAdmin={isAdmin}
            setKudosTask={setKudosTask}
            setKudosModalOpen={setKudosModalOpen}
            editTask={editTask}
            setSelectedTask={setSelectedTask}
            setArchiveModalOpen={setArchiveModalOpen}
            tasks={tableTasks}
            setDeleteModalOpen={setDeleteModalOpen}
          />
        </StyledTable>

        <LoadMore ref={ref} hasMore={hasMore} />
      </StyledTableContainer>
    </>
  );
};
