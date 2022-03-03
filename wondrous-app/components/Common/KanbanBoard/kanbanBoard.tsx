import { useRouter } from 'next/router';
import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useInView } from 'react-intersection-observer';
import usePrevious, { useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks';
import { TaskViewModal } from '../Task/modal';
import { KanbanBoardContainer, LoadMore } from './styles';
import TaskColumn from './TaskColumn';

// Task update (column changes)
import apollo from '../../../services/apollo';
import { UPDATE_TASK_STATUS, UPDATE_TASK_ORDER } from '../../../graphql/mutations/task';
import { parseUserPermissionContext } from '../../../utils/helpers';
import { BOARD_TYPE, PERMISSIONS, PAYMENT_STATUS } from '../../../utils/constants';
import { useMe } from '../../Auth/withAuth';
import {
  GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
  GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE,
} from '../../../graphql/queries';
import { ColumnsContext } from '../../../utils/contexts';
import { useMutation } from '@apollo/client';
import { dedupeColumns, delQuery } from '../../../utils';
import DndErrorModal from './DndErrorModal';

const populateOrder = (index, tasks, field) => {
  let aboveOrder = null,
    belowOrder = null;
  if (index > 0) {
    aboveOrder = tasks[index - 1][field];
  }
  if (index < tasks.length - 1) {
    belowOrder = tasks[index + 1][field];
  }
  return {
    aboveOrder,
    belowOrder,
  };
};

const KanbanBoard = (props) => {
  const user = useMe();
  const { columns, onLoadMore, hasMore } = props;
  const [columnsState, setColumnsState] = useState([]);
  const [ref, inView] = useInView({});
  const [openModal, setOpenModal] = useState(false);
  const [once, setOnce] = useState(false);
  const router = useRouter();
  const [updateTaskOrder] = useMutation(UPDATE_TASK_ORDER);
  const [dndErrorModal, setDndErrorModal] = useState(false);
  // Permissions for Draggable context
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;

  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore();
    }
    if (columnsState.length === 0) {
      setColumnsState(columns);
    }
  }, [inView, hasMore, onLoadMore, columns, columnsState]);

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
  const prevColumnState = usePrevious(columnsState);
  const updateTask = async (taskToBeUpdated) => {
    try {
      const {
        data: { updateTask: task },
      } = await apollo.mutate({
        mutation: UPDATE_TASK_STATUS,
        variables: {
          taskId: taskToBeUpdated.id,
          input: {
            newStatus: taskToBeUpdated.status,
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
          'getSubtaskCountForTask',
        ],
      });

      return true;
    } catch (err) {
      if (err?.graphQLErrors && err?.graphQLErrors.length > 0) {
        if (err?.graphQLErrors[0].extensions?.errorCode === 'must_go_through_submission') {
          setDndErrorModal(true);
          setColumnsState(prevColumnState);
        }
      }
    }
  };

  const moveCard = async (id, status, index) => {
    const updatedColumns = columnsState.map((column) => {
      const task = columnsState.map(({ tasks }) => tasks.find((task) => task.id === id)).filter((i) => i)[0];
      // Only allow when permissions are OK
      if (task?.paymentStatus !== PAYMENT_STATUS.PAID && task?.paymentStatus !== PAYMENT_STATUS.PROCESSING) {
        if (column.status !== status) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== id),
          };
        }
        const updatedTask = checkPermissions(task) ? { ...task, status } : task;

        if (updatedTask.status !== task.status) {
          updateTask(updatedTask);
        }
        if (checkPermissions(task)) {
          const filteredColumn = column.tasks.filter((task) => task.id !== id);
          const newTasks = [...filteredColumn.slice(0, index), updatedTask, ...filteredColumn.slice(index)];
          let aboveOrder, belowOrder;
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
          } catch (err) {}
          return {
            ...column,
            tasks: newTasks,
          };
        } else {
          return {
            ...column,
            tasks: [updatedTask, ...column.tasks],
          };
        }
      } else {
        return column;
      }
    });
    setColumnsState(dedupeColumns(updatedColumns));
  };

  const hasQuery = router?.query?.task || router?.query?.taskProposal;
  useEffect(() => {
    if (hasQuery && !once && (orgBoard || userBoard || podBoard)) {
      setOpenModal(true);
      setOnce(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasQuery, orgBoard || userBoard || podBoard]);

  const onDragEnd = (result) => {
    moveCard(result?.draggableId, result?.destination?.droppableId, result?.destination?.index);
  };

  return (
    <ColumnsContext.Provider
      value={{
        columns: columnsState,
        setColumns: setColumnsState,
      }}
    >
      <KanbanBoardContainer>
        <DndErrorModal open={dndErrorModal} handleClose={() => setDndErrorModal(false)} />
        <TaskViewModal
          disableEnforceFocus
          open={openModal}
          shouldFocusAfterRender={false}
          handleClose={() => {
            const style = document.body.getAttribute('style');
            const top = style.match(/(?<=top: -)(.*?)(?=px)/);
            document.body.setAttribute('style', '');
            if (top?.length > 0) {
              window?.scrollTo(0, Number(top[0]));
            }
            setOpenModal(false);
          }}
          taskId={router?.query?.task || router?.query?.taskProposal}
          isTaskProposal={!!router?.query?.taskProposal}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          {columnsState.map((column) => {
            const { status, section, tasks } = column;

            return (
              <TaskColumn
                onOpen={() => setOnce(true)}
                key={status}
                cardsList={tasks}
                moveCard={moveCard}
                status={status}
                section={section}
              />
            );
          })}
        </DragDropContext>
      </KanbanBoardContainer>
      <LoadMore ref={ref} hasMore={hasMore}></LoadMore>
    </ColumnsContext.Provider>
  );
};

export default KanbanBoard;
