import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import CreateBtnIcon from 'components/Icons/createBtn';
import { useInView } from 'react-intersection-observer';

import {
  PERMISSIONS,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_TODO,
  ENTITIES_TYPES,
  BOARD_TYPE,
  STATUS_OPEN,
  STATUS_APPROVED,
  STATUS_CLOSED,
} from 'utils/constants';
import { LIMIT } from 'services/board';
import Task from 'components/Common/Task';
import { LoadMore } from 'components/Common/KanbanBoard/styles';

import Milestone from 'components/Common/Milestone';
import { useMe } from 'components/Auth/withAuth';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import CreateBtnIconDark from 'components/Icons/createBtnIconDark';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import CreateEntityModal from 'components/CreateEntity/CreateEntityModal';
import EmptyStateBoards from 'components/EmptyStateBoards';
import Droppable from 'components/StrictModeDroppable';
import {
  TaskColumnContainer,
  TaskColumnContainerHeader,
  TaskColumnContainerHeaderTitle,
  TaskColumnContainerCount,
  TaskListContainer,
} from './styles';
import { ColumnSection } from '../../ColumnSection';
import { ToDo, InProgress, Done, InReview, Proposal, Approved, Rejected } from '../../../Icons';

interface ITaskColumn {
  cardsList: Array<any>;
  moveCard: any;
  status: string;
  section: Array<any>;
}

const TITLES = {
  [TASK_STATUS_TODO]: 'To-do',
  [TASK_STATUS_IN_PROGRESS]: 'In-Progress',
  [TASK_STATUS_IN_REVIEW]: 'In-Review',
  [TASK_STATUS_DONE]: 'Done',
  // PROPOSALS
  [STATUS_OPEN]: 'Open',
  [STATUS_APPROVED]: 'Approved',
  [STATUS_CLOSED]: 'Rejected',
};

const HEADER_ICONS = {
  [TASK_STATUS_TODO]: ToDo,
  [TASK_STATUS_IN_PROGRESS]: InProgress,
  [TASK_STATUS_IN_REVIEW]: InReview,
  [TASK_STATUS_DONE]: Done,
  [STATUS_OPEN]: Proposal,
  [STATUS_APPROVED]: Approved,
  [STATUS_CLOSED]: Rejected,
};

function TaskColumn(props: ITaskColumn) {
  const { cardsList, moveCard, status, section } = props;
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(false);
  const [ref, inView] = useInView({});

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
      <Droppable droppableId={status}>
        {(provided) => (
          <TaskListContainer ref={provided.innerRef} {...provided.droppableProps}>
            {cardsList?.length ? (
              cardsList.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index} isDragDisabled={board?.isDragDisabled}>
                  {(provided, snapshot) => (
                    <div
                      style={{
                        width: '100%',
                        background: 'red',
                      }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      isDragging={snapshot.isDragging}
                    >
                      {card.type === ENTITIES_TYPES.MILESTONE && !card.isProposal ? (
                        <Milestone>
                          <Task task={card} />
                        </Milestone>
                      ) : (
                        <Task task={card} />
                      )}
                    </div>
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
