import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import SwipeableViews from 'react-swipeable-views';
import usePrevious, { useIsMobile, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { useLocation } from 'utils/useLocation';
import TaskViewModal from 'components/Common/TaskViewModal';
import {
  ENTITIES_TYPES,
  BOARD_TYPE,
  PERMISSIONS,
  PAYMENT_STATUS,
  STATUS_APPROVED,
  STATUS_CLOSED,
  TASK_STATUS_DONE,
} from 'utils/constants';
// Task update (column changes)
import apollo from 'services/apollo';
import { UPDATE_TASK_STATUS, UPDATE_TASK_ORDER } from 'graphql/mutations/task';
import { APPROVE_TASK_PROPOSAL, CLOSE_TASK_PROPOSAL } from 'graphql/mutations/taskProposal';
import { GET_SUBMISSION_COUNT_FOR_TASK } from 'graphql/queries/task';
import { parseUserPermissionContext, enableContainerOverflow } from 'utils/helpers';
import { useMutation } from '@apollo/client';
import { dedupeColumns, delQuery } from 'utils';
import ConfirmModal from 'components/Common/ConfirmModal';
import { useMe } from '../../Auth/withAuth';
import DndErrorModal from './DndErrorModal';
import TaskColumn from './TaskColumn';
import { KanbanBoardContainer, KanbanBoardPaginationContainer, KanbanBoardPaginationStepper } from './styles';
import PaginationDot from './PaginationDot';

export const populateOrder = (index, tasks, field) => {
  let aboveOrder = null;
  let belowOrder = null;
  if (index > 0) {
    aboveOrder = tasks[index - 1][field];
  }
  if (index < tasks.length - 1) {
    belowOrder = tasks[index][field];
  }
  return {
    aboveOrder,
    belowOrder,
  };
};

function KanbanBoard(props) {
  const user = useMe();
  const isMobile = useIsMobile();
  const { columns, onLoadMore, hasMore, setColumns } = props;
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const [updateTaskOrder] = useMutation(UPDATE_TASK_ORDER);
  const [dndErrorModal, setDndErrorModal] = useState(false);
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL);
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL);
  const [taskToConfirm, setTaskToConfirm] = useState<any>(null);
  const kanbanBoardRef = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const maxSteps = columns.length;

  // Permissions for Draggable context
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || userBoard || podBoard;
  const isProposalEntity = board?.entityType === ENTITIES_TYPES.PROPOSAL;
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;
  const [draggingTask, setDraggingTask] = useState(null);

  const getTaskById = useCallback(
    (taskId) => columns.map(({ tasks }) => tasks.find((task) => task.id === taskId)).filter((i) => i)[0],
    [columns]
  );

  const checkPermissions = (task) => {
    const permissions = parseUserPermissionContext({
      userPermissionsContext,
      orgId: task?.orgId,
      podId: task?.podId,
    });
    const canEdit =
      permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
      permissions.includes(PERMISSIONS.FULL_ACCESS) ||
      task?.createdBy === user?.id ||
      (task?.assigneeId && task?.assigneeId === user?.id);

    return canEdit && user && task;
  };

  // Updates the task status on Backend
  // TODO: Aggregate all Task mutations on one Task
  //       service.
  const prevColumnState = usePrevious(columns);
  const updateTaskStatus = async (taskToBeUpdated, aboveOrder, belowOrder) => {
    let currentBoard: String;
    if (orgBoard) {
      currentBoard = 'org';
    }
    if (podBoard) {
      currentBoard = 'pod';
    }
    if (userBoard) {
      currentBoard = 'assignee';
    }
    try {
      await apollo.mutate({
        mutation: UPDATE_TASK_STATUS,
        variables: {
          taskId: taskToBeUpdated.id,
          input: {
            newStatus: taskToBeUpdated.status,
            board: currentBoard,
            aboveOrder,
            belowOrder,
          },
        },
        refetchQueries: () => [
          'getUserTaskBoardTasks',
          'getOrgTaskBoardTasks',
          'getPodTaskBoardTasks',
          'getPerStatusTaskCountForMilestone',
          'getPerStatusTaskCountForUserBoard',
          'getPerStatusTaskCountForOrgBoard',
          'getPerStatusTaskCountForPodBoard',
        ],
      });

      return true;
    } catch (err) {
      if (err?.graphQLErrors && err?.graphQLErrors.length > 0) {
        if (err?.graphQLErrors[0].extensions?.errorCode === 'must_go_through_submission') {
          setDndErrorModal(true);
          setColumns(prevColumnState);
        }
      }
    }
  };

  const moveCard = async (id, status, index, source) => {
    // TODO get rid of nested loop
    const updatedColumns = columns.map((column) => {
      const task = getTaskById(id);
      // Only allow when permissions are OK
      if (task?.paymentStatus !== PAYMENT_STATUS.PAID && task?.paymentStatus !== PAYMENT_STATUS.PROCESSING) {
        if (column.status !== status) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== id),
          };
        }
        const updatedTask = checkPermissions(task) ? { ...task, status } : task;
        if (checkPermissions(task)) {
          const filteredColumn = column.tasks.filter((task) => task.id !== id);
          const newTasks = [...filteredColumn.slice(0, index), updatedTask, ...filteredColumn.slice(index)];
          let aboveOrder;
          let belowOrder;
          let board = null;
          if (orgBoard) {
            board = BOARD_TYPE.org;
            aboveOrder = populateOrder(index, newTasks, 'orgOrder').aboveOrder;
            belowOrder = populateOrder(index, column.tasks, 'orgOrder').belowOrder;
          } else if (podBoard) {
            board = BOARD_TYPE.pod;
            aboveOrder = populateOrder(index, newTasks, 'podOrder').aboveOrder;
            belowOrder = populateOrder(index, newTasks, 'podOrder').belowOrder;
          } else if (userBoard) {
            board = BOARD_TYPE.assignee;
            aboveOrder = populateOrder(index, newTasks, 'assigneeOrder').aboveOrder;
            belowOrder = populateOrder(index, newTasks, 'assigneeOrder').belowOrder;
          }

          try {
            if (updatedTask.status !== task.status) {
              updateTaskStatus(updatedTask, aboveOrder, belowOrder);
            } else {
              updateTaskOrder({
                variables: {
                  taskId: updatedTask?.id,
                  input: {
                    belowOrder,
                    aboveOrder,
                    board,
                  },
                },
              }).catch(() => {});
            }
          } catch (err) {}
          return {
            ...column,
            tasks: newTasks,
          };
        }
        return {
          ...column,
          tasks: [updatedTask, ...column.tasks],
        };
      }
      return column;
    });
    setColumns(dedupeColumns(updatedColumns));
  };

  const moveProposal = async (id, destinationStatus, destinationIndex, { index, droppableId }) => {
    const boardColumns = [...columns];
    const sourceColumn = boardColumns.findIndex((column) => column.status === droppableId);
    const taskToUpdate = boardColumns[sourceColumn]?.tasks[index];
    const destinationColumn = boardColumns.findIndex((column) => column.status === destinationStatus);

    if (droppableId === STATUS_APPROVED) {
      return;
    }
    if (checkPermissions(taskToUpdate)) {
      if (destinationStatus !== droppableId) {
        if (destinationStatus === STATUS_APPROVED) {
          approveTaskProposal({
            variables: {
              proposalId: id,
            },
            onCompleted: () => {
              boardColumns[sourceColumn]?.tasks?.splice(index, 1);
              boardColumns[destinationColumn]?.tasks?.unshift(taskToUpdate);
              setColumns(dedupeColumns(boardColumns));
            },
            refetchQueries: ['GetOrgTaskBoardProposals', 'getPerStatusTaskCountForOrgBoard'],
          });
          return;
        }
        if (destinationStatus === STATUS_CLOSED) {
          closeTaskProposal({
            variables: {
              proposalId: id,
            },
            onCompleted: () => {
              boardColumns[sourceColumn]?.tasks?.splice(index, 1);
              const updatedTask = { ...taskToUpdate, closedAt: new Date() };
              boardColumns[destinationColumn]?.tasks?.unshift(updatedTask);
              setColumns(dedupeColumns(boardColumns));
            },
            refetchQueries: ['GetOrgTaskBoardProposals', 'getPerStatusTaskCountForOrgBoard'],
          });
        }
      }
    }
  };

  const location = useLocation();

  const confirmCardMove = (moveAction) => async (id, status, index, source) => {
    const sourceColumn = columns.findIndex((column) => column.status === source.droppableId);
    const taskToUpdate = columns[sourceColumn]?.tasks.find((task) => task?.id === id);
    const taskType = taskToUpdate?.isProposal ? 'taskProposal' : 'task';
    let viewUrl = `${delQuery(router.asPath)}?${taskType}=${taskToUpdate?.id}&view=${router.query.view || 'grid'}`;
    if (board?.entityType) {
      viewUrl += `&entity=${board?.entityType}`;
    }
    let shouldConfirmInReviewTask = false;
    let pendingSubmissionCount = 0;
    if (status === TASK_STATUS_DONE) {
      try {
        const { data } = await apollo.query({
          query: GET_SUBMISSION_COUNT_FOR_TASK,
          variables: {
            taskId: id,
            status: 'waiting_for_review',
          },
        });
        shouldConfirmInReviewTask = data?.getSubmissionCountForTask?.submissionCount > 0;
        pendingSubmissionCount = data?.getSubmissionCountForTask?.submissionCount;
      } catch (e) {
        // error fetching this, not a big deal
        console.error(e);
      }
    }
    if (shouldConfirmInReviewTask) {
      setTaskToConfirm({
        task: {
          id: taskToUpdate?.id,
          waitingForReviewSubmissionsCount: pendingSubmissionCount,
          title: taskToUpdate?.title,
        },
        confirmTitle: `Task ${taskToUpdate?.title} has submissions you need to review`,
        confirmAction: () => {
          setTaskToConfirm(null);
          moveAction(id, status, index, source);
        },
        closeAction: () => {
          setTaskToConfirm(null);
          location.push(viewUrl);
        },
      });
      return;
    }
    return moveAction(id, status, index, source);
  };

  const handleScrollToView = () => {
    if (kanbanBoardRef?.current) {
      kanbanBoardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  };

  const handleStepChange = (step: number) => setActiveStep(step);

  useEffect(() => {
    const { params } = location;
    if ((params.task || params.taskProposal) && (orgBoard || userBoard || podBoard)) {
      setOpenModal(true);
    }
  }, [orgBoard, podBoard, userBoard, location]);

  useEffect(() => handleScrollToView(), [activeStep]);
  const onDragStart = (event) => {
    const task = getTaskById(event.draggableId);

    setDraggingTask(task);
  };

  const onDragEnd = (result) => {
    setDraggingTask(null);

    const moveAction = isProposalEntity ? moveProposal : confirmCardMove(moveCard);
    try {
      moveAction(result.draggableId, result.destination.droppableId, result.destination.index, result.source);
    } catch {
      console.error('The card was dropped outside the context of DragDropContext.');
    }
  };

  const handleClose = () => {
    const style = document.body.getAttribute('style');
    const top = style.match(/(top: -)(.*?)(?=px)/);
    document.body.setAttribute('style', '');
    if (top?.length > 0) {
      window?.scrollTo(0, Number(top[2]));
    }
    let newUrl = `${delQuery(router.asPath)}?view=${location?.params?.view || 'grid'}`;
    if (board?.entityType) {
      newUrl += `&entity=${board?.entityType}`;
    }
    location.push(newUrl);
    enableContainerOverflow();
    setOpenModal(false);
  };

  const taskId = (location?.params?.task || location?.params.taskProposal)?.toString() || taskToConfirm?.id;

  return (
    <KanbanBoardContainer>
      <DndErrorModal open={dndErrorModal} handleClose={() => setDndErrorModal(false)} />
      <ConfirmModal
        open={!!taskToConfirm}
        onClose={() => {
          setTaskToConfirm(null);
        }}
        onSubmit={taskToConfirm?.closeAction}
        title={taskToConfirm?.confirmTitle}
        submitLabel="Review"
        cancelLabel="Move anyway"
        rejectAction={taskToConfirm?.confirmAction}
        reverseButtons
      >
        {null}
      </ConfirmModal>

      <TaskViewModal
        disableEnforceFocus
        open={openModal}
        shouldFocusAfterRender={false}
        handleClose={handleClose}
        taskId={taskId}
        isTaskProposal={!!location?.params?.taskProposal}
        key={taskId}
      />
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        {isMobile ? (
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
            key={activeStep}
          >
            {columns.map((column) => {
              const { status, section, tasks } = column;

              return (
                <TaskColumn
                  key={status}
                  cardsList={tasks}
                  moveCard={moveCard}
                  status={status}
                  section={section}
                  draggingTask={draggingTask}
                  kanbanBoardRef={kanbanBoardRef}
                />
              );
            })}
          </SwipeableViews>
        ) : (
          <>
            {columns.map((column) => {
              const { status, section, tasks } = column;

              return (
                <TaskColumn
                  key={status}
                  cardsList={tasks}
                  moveCard={moveCard}
                  status={status}
                  section={section}
                  draggingTask={draggingTask}
                  kanbanBoardRef={kanbanBoardRef}
                />
              );
            })}
          </>
        )}
      </DragDropContext>
      {isMobile ? (
        <KanbanBoardPaginationContainer>
          <KanbanBoardPaginationStepper>
            {Array.from(Array(maxSteps).keys()).map((step: number) => (
              <PaginationDot key={step} active={activeStep === step} onClick={() => handleStepChange(step)} />
            ))}
          </KanbanBoardPaginationStepper>
        </KanbanBoardPaginationContainer>
      ) : null}
    </KanbanBoardContainer>
  );
}

export default KanbanBoard;
