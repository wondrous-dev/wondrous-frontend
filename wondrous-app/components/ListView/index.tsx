import { useMutation } from '@apollo/client';
import { useMe } from 'components/Auth/withAuth';
import { populateOrder } from 'components/Common/KanbanBoard/kanbanBoard';
import TaskViewModal from 'components/Common/TaskViewModal';
import { UPDATE_TASK_ORDER, UPDATE_TASK_STATUS } from 'graphql/mutations/task';
import { APPROVE_TASK_PROPOSAL, CLOSE_TASK_PROPOSAL } from 'graphql/mutations/taskProposal';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useHotkeys } from 'react-hotkeys-hook';
import apollo from 'services/apollo';
import { dedupeColumns, delQuery } from 'utils';
import {
  BOARD_TYPE,
  ENTITIES_TYPES,
  OPEN_TASK_METHOD,
  PAYMENT_STATUS,
  PERMISSIONS,
  STATUS_APPROVED,
  STATUS_CLOSED,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_TODO,
} from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import usePrevious, { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { ARROW_KEYS, pickHotkeyFunction } from 'utils/hotkeyHelper';
import { useLocation } from 'utils/useLocation';
import ItemsContainer from './ItemsContainer';

interface Props {
  columns: any[];
  onLoadMore: any;
  hasMore: boolean;
  entityType?: string;
}

const STATUS_MAP = {
  [TASK_STATUS_TODO]: 'created',
  [TASK_STATUS_IN_PROGRESS]: 'inProgress',
  [TASK_STATUS_IN_REVIEW]: 'inReview',
  [TASK_STATUS_DONE]: 'completed',
};

export default function ListView({ columns, onLoadMore, hasMore, ...props }: Props) {
  const [isModalOpen, setOpenModal] = useState(false);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || userBoard || podBoard;
  const router = useRouter();
  const { taskCount = {}, fetchPerStatus, entityType, setColumns } = orgBoard || podBoard || userBoard;
  const location = useLocation();
  const isProposalEntity = entityType === ENTITIES_TYPES.PROPOSAL;
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL);
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL);
  const [updateTaskOrder] = useMutation(UPDATE_TASK_ORDER);
  const [taskIndex, setTaskIndex] = useState(null);
  const [statusIndex, setStatusIndex] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [statusPicked, setStatusPicked] = useState(null);
  const [byLinkOrHot, setByLinkOrHot] = useState(OPEN_TASK_METHOD.link);
  const user = useMe();

  const handleStatusPicked = (status) => {
    setByLinkOrHot(OPEN_TASK_METHOD.link);
    setStatusPicked(status);
  };

  useEffect(() => {
    const { params } = location;
    if (!(params.task || params.taskProposal || orgBoard || userBoard || podBoard)) {
      return;
    }
    if (location.params.task && byLinkOrHot === OPEN_TASK_METHOD.link) {
      const holdTaskId = location.params.task;
      const holdStatusIndex = columns.findIndex((status) => status.status === statusPicked);
      const holdTaskIndex = columns[holdStatusIndex]?.tasks.findIndex((task) => task.id === holdTaskId);
      setTaskIndex(holdTaskIndex);
      setStatusIndex(holdStatusIndex);
    }
    setOpenModal(true);
  }, [orgBoard, podBoard, userBoard, location]);

  const handleModalClose = () => {
    setTaskIndex(null);
    setStatusIndex(null);
    const style = document.body.getAttribute('style');
    const top = style.match(/(?<=top: -)(.*?)(?=px)/);
    document.body.setAttribute('style', '');
    if (top?.length > 0) {
      window?.scrollTo(0, Number(top[0]));
    }
    const newUrl = `${delQuery(router.asPath)}?view=${location?.params?.view || 'grid'}&entity=${
      location?.params?.entity || ENTITIES_TYPES.TASK
    }`;
    location.push(newUrl);
    setOpenModal(false);
  };

  useHotkeys(
    '*',
    (event) => {
      if (Object.values(ARROW_KEYS).includes(event.key) && board?.entityType === ENTITIES_TYPES.TASK) {
        setOpenModal(true);

        setByLinkOrHot(OPEN_TASK_METHOD.hot);
        const { holdTaskIndex, holdStatusIndex } = pickHotkeyFunction(event.key, taskIndex, statusIndex, columns);
        setStatusIndex(holdStatusIndex);
        setTaskIndex(holdTaskIndex);
        if (holdStatusIndex === null) {
          setOpenModal(false);
        }
        setTaskId(columns?.[holdStatusIndex]?.tasks?.[holdTaskIndex]?.id);
      }
    },
    [taskIndex, statusIndex, isModalOpen, columns]
  );

  const handleShowAll = (status, limit) => fetchPerStatus(status, limit);

  const prevColumnState = usePrevious(columns);

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

  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;

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
            onCompleted: (data) => {
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
            onCompleted: (data) => {
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
      const {
        data: { updateTask: task },
      } = await apollo.mutate({
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
          'getPerStatusTaskCountForUserBoard',
          'getPerStatusTaskCountForOrgBoard',
          'getPerStatusTaskCountForPodBoard',
        ],
      });

      return true;
    } catch (err) {
      if (err?.graphQLErrors && err?.graphQLErrors.length > 0) {
        if (err?.graphQLErrors[0].extensions?.errorCode === 'must_go_through_submission') {
          setColumns(prevColumnState);
        }
      }
    }
  };

  const moveCard = async (id, status, index, source) => {
    // TODO get rid of nested loop
    const updatedColumns = columns.map((column) => {
      const task = columns.map(({ tasks }) => tasks.find((task) => task.id === id)).filter((i) => i)[0];
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
              }).catch((e) => {});
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

  const onDragEnd = (result) => {
    const moveAction = isProposalEntity ? moveProposal : moveCard;
    try {
      moveAction(result.draggableId, result.destination.droppableId, result.destination.index, result.source);
    } catch {
      console.error('The card was dropped outside the context of DragDropContext.');
    }
  };

  return (
    <>
      <TaskViewModal
        open={isModalOpen}
        handleClose={handleModalClose}
        isTaskProposal={!!location.params.taskProposal}
        taskId={
          byLinkOrHot === OPEN_TASK_METHOD.link
            ? (location.params.taskProposal ?? location.params.task)?.toString()
            : taskId
        }
      />
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((column) => {
          if (!column) return null;
          const count = (taskCount && taskCount[STATUS_MAP[column?.status]]) || 0;
          return (
            <Droppable droppableId={column?.status}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <ItemsContainer
                    handleStatusPicked={handleStatusPicked}
                    entityType={entityType}
                    data={column}
                    taskCount={count}
                    fetchPerStatus={fetchPerStatus}
                    handleShowAll={handleShowAll}
                  />
                </div>
              )}
            </Droppable>
          );
        })}
      </DragDropContext>
    </>
  );
}
