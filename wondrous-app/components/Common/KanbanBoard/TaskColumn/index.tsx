import React, { useEffect, useMemo, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useInView } from 'react-intersection-observer';

import {
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_TODO,
  ENTITIES_TYPES,
  STATUS_OPEN,
  STATUS_APPROVED,
  STATUS_CLOSED,
  HEADER_ICONS,
  TITLES,
} from 'utils/constants';
import { LIMIT } from 'services/board';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { taskHasPayment } from 'utils/board';
import { TaskInterface } from 'types/task';

import Task from 'components/Common/Task';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import Milestone from 'components/Common/Milestone';
import CreateBtnIconDark from 'components/Icons/createBtnIconDark';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import CreateEntityModal from 'components/CreateEntity/CreateEntityModal';
import EmptyStateBoards from 'components/EmptyStateBoards';
import Droppable from 'components/StrictModeDroppable';
import { ColumnSection } from 'components/Common/ColumnSection';

import {
  TaskColumnContainer,
  TaskColumnContainerHeader,
  TaskColumnContainerHeaderTitle,
  TaskColumnContainerCount,
  TaskListContainer,
  TaskColumnItemWrapper,
} from './styles';

interface ITaskColumn {
  cardsList: Array<any>;
  moveCard: any;
  status: string;
  section: Array<any>;
  draggingTask: TaskInterface | null;
}

function TaskColumn(props: ITaskColumn) {
  const { cardsList, status, section, draggingTask } = props;
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(false);
  const [ref, inView] = useInView({});

  const isTaskDragging = useMemo(() => draggingTask !== null, [draggingTask]);
  const isDropDisabled = useMemo(
    () => isTaskDragging && taskHasPayment(draggingTask) && status !== TASK_STATUS_DONE,
    [draggingTask, isTaskDragging, status]
  );

  const board = orgBoard || userBoard || podBoard;
  const taskCount = board?.taskCount;
  const HeaderIcon = HEADER_ICONS[status];
  let number;

  useEffect(() => {
    if (inView && board?.hasMore && LIMIT <= cardsList.length) {
      board?.onLoadMore();
    }
  }, [inView, board?.hasMore]);

  let taskColumnWidth = '100%';
  if (!userBoard) {
    taskColumnWidth = '25%';
  }
  switch (status) {
    case TASK_STATUS_TODO:
      number = taskCount?.created || 0;
      break;
    case TASK_STATUS_IN_PROGRESS:
      number = taskCount?.inProgress || 0;
      break;
    case TASK_STATUS_REQUESTED:
      number = taskCount?.proposal || 0;
      break;
    case TASK_STATUS_DONE:
      number = taskCount?.completed || 0;
      break;
    case TASK_STATUS_IN_REVIEW:
      // TODO fix me
      number = taskCount?.submission || taskCount?.inReview || 0;
      break;
    case STATUS_OPEN:
      number = taskCount?.proposalOpen || 0;
      taskColumnWidth = '33.3%';
      break;
    case STATUS_APPROVED:
      number = taskCount?.proposalApproved || 0;
      taskColumnWidth = '33.3%';
      break;
    case STATUS_CLOSED:
      number = taskCount?.proposalClosed || 0;
      taskColumnWidth = '33.3%';
      break;
    default:
      number = 0;
      break;
  }

  return (
    <TaskColumnContainer
      onMouseEnter={() => status === TASK_STATUS_TODO && setIsAddButtonVisible(true)}
      onMouseLeave={() => status === TASK_STATUS_TODO && setIsAddButtonVisible(false)}
      activeEntityType={board?.entityType || ''}
      style={{
        width: taskColumnWidth,
      }}
    >
      <CreateModalOverlay
        style={{
          height: '95vh',
        }}
        open={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
      >
        <CreateEntityModal
          entityType={ENTITIES_TYPES.TASK}
          handleClose={() => setOpenTaskModal(false)}
          resetEntityType={() => {}}
          setEntityType={() => {}}
          cancel={() => setOpenTaskModal(false)}
        />
      </CreateModalOverlay>

      <TaskColumnContainerHeader>
        <HeaderIcon />
        <TaskColumnContainerHeaderTitle>{TITLES[status]}</TaskColumnContainerHeaderTitle>
        <TaskColumnContainerCount>{number}</TaskColumnContainerCount>
        <div
          style={{
            flex: 1,
          }}
        />
        {status === TASK_STATUS_TODO && isAddButtonVisible && (
          <CreateBtnIconDark
            onClick={() => setOpenTaskModal(true)}
            width="26"
            height="28"
            style={{
              marginLeft: '16px',
              cursor: 'pointer',
            }}
          />
        )}
      </TaskColumnContainerHeader>
      {section && <ColumnSection section={section} setSection={() => {}} />}
      <Droppable droppableId={status} isDropDisabled={isDropDisabled}>
        {(provided) => (
          <TaskListContainer
            highlighted={isTaskDragging && !isDropDisabled}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cardsList?.length ? (
              cardsList.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index} isDragDisabled={board?.isDragDisabled}>
                  {(provided, snapshot) => (
                    <TaskColumnItemWrapper
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      isDragging={snapshot.isDragging}
                      style={{
                        ...provided.draggableProps.style,
                        userSelect: 'none',
                        cursor: board?.isDragDisabled ? 'default' : 'move',
                      }}
                    >
                      {card.type === ENTITIES_TYPES.MILESTONE && !card.isProposal ? (
                        <Milestone>
                          <Task task={card} />
                        </Milestone>
                      ) : (
                        <Task task={card} />
                      )}
                    </TaskColumnItemWrapper>
                  )}
                </Draggable>
              ))
            ) : (
              <EmptyStateBoards status={status} hidePlaceholder={board?.entityType === ENTITIES_TYPES.PROPOSAL} />
            )}
            <LoadMore ref={ref} hasMore={board?.hasMore} />
            {provided.placeholder}
          </TaskListContainer>
        )}
      </Droppable>
    </TaskColumnContainer>
  );
}

export default TaskColumn;
