import { useApolloClient, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { UNARCHIVE_TASK, ARCHIVE_TASK } from 'graphql/mutations';
import { GET_TASK_REVIEWERS } from 'graphql/queries';
import { ViewType } from 'types/common';
import { delQuery } from 'utils';
import * as Constants from 'utils/constants';
import { ENTITIES_TYPES, TASK_STATUS_PROPOSAL_REQUEST, TASK_STATUS_SUBMISSION_REQUEST } from 'utils/constants';
import { useColumns } from 'utils/hooks';
import TaskViewModal from 'components/Common/TaskViewModal';
import DeleteTaskModal from 'components/Common/DeleteTaskModal';
import { CreateEntity } from 'components/CreateEntity';
import { ArchiveTaskModal } from '../Common/ArchiveTaskModal';
import { LoadMore } from '../Common/KanbanBoard/styles';
import KudosForm from '../Common/KudosForm';
import { SnackbarAlertContext } from '../Common/SnackbarAlert';
import { ArchivedTaskUndo } from '../Common/Task/styles';
import { StyledTable, StyledTableCell, StyledTableContainer, StyledTableHead, StyledTableRow } from './styles';
import TableBody from './TableBody';

const createTasksFromColumns = (columns) =>
  columns.reduce((acc, column) => {
    const newColumnTasks = column?.tasks?.map((task) => ({
      ...task,
      status: column?.status || task?.status,
    }));
    acc = [...acc, ...newColumnTasks];
    if (column?.section?.tasks) {
      const newColumnSectionTasks = column?.section?.tasks?.map((task) => {
        if (column?.status === Constants.TASK_STATUS_TODO) {
          return {
            ...task,
            status: TASK_STATUS_PROPOSAL_REQUEST,
          };
        }
        if (column?.status === Constants.TASK_STATUS_IN_PROGRESS) {
          return {
            ...task,
            status: TASK_STATUS_SUBMISSION_REQUEST,
          };
        }
        return task;
      });

      acc = [...acc, ...newColumnSectionTasks];
    }
    return acc;
  }, []);

function Table(props) {
  const { columns, onLoadMore, hasMore, allTasks, limit, isAdmin, tasks, entityType } = props;
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [editableTask, setEditableTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isArchiveModalOpen, setArchiveModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isKudosModalOpen, setKudosModalOpen] = useState(false);
  const [kudosTask, setKudosTask] = useState(null);
  const [ref, inView] = useInView({});
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const boardColumns = useColumns();

  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore]);

  const [unarchiveTaskMutation, { data: unarchiveTaskData }] = useMutation(UNARCHIVE_TASK, {
    refetchQueries: [
      'getTaskById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getOrgTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForPodBoard',
    ],
    onError: () => {
      console.error('Something went wrong unarchiving tasks');
    },
    onCompleted: () => {
      // TODO: Move columns
      // let columns = [...boardColumns?.columns]
    },
  });

  async function editTask(task, status = '') {
    const populatedTask = { ...task };
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

  async function archiveTask(task) {
    const newColumns = [...boardColumns.columns];
    const column = newColumns.find((column) => column.tasks?.includes(task));
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
            unarchiveTaskMutation({
              variables: {
                taskId: task?.taskId ?? task?.id,
              },
            });
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

  const tableTasks = tasks || createTasksFromColumns(columns);

  return (
    <>
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
      {editableTask && (
        <CreateEntity
          open={Boolean(open)}
          handleCloseModal={() => {
            setEditableTask(false);
          }}
          entityType={editableTask?.isProposal ? ENTITIES_TYPES.PROPOSAL : editableTask?.type || ENTITIES_TYPES.TASK}
          handleClose={() => setEditableTask(false)}
          cancel={() => setEditableTask(false)}
          existingTask={editableTask}
          isTaskProposal={editableTask.type === Constants.TASK_STATUS_REQUESTED}
        />
      )}
      <KudosForm onClose={handleKudosFormOnClose} open={isKudosModalOpen} submission={kudosTask} />

      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableCell align="center" width="56px">
                Org
              </StyledTableCell>
              {entityType === ENTITIES_TYPES.TASK || isAdmin ? (
                <StyledTableCell align="center" width="105px">
                  {isAdmin ? 'Created by' : 'Assigned'}
                </StyledTableCell>
              ) : null}
              <StyledTableCell align="center" width="77px">
                Status
              </StyledTableCell>
              <StyledTableCell width="383px"> {isAdmin ? 'Submission' : 'Task'}</StyledTableCell>
              {/* <StyledTableCell width="190px">Deliverables</StyledTableCell> */}
              <StyledTableCell align="center" width="88px">
                Reward
              </StyledTableCell>
              {isAdmin && (
                <StyledTableCell align="center" width="80px">
                  Decision
                </StyledTableCell>
              )}
              <StyledTableCell width="54px" />
            </StyledTableRow>
          </StyledTableHead>
          <TableBody
            limit={limit}
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
}

export default Table;
