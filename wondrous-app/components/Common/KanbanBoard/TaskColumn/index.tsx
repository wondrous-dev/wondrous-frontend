import React, { useCallback, useRef, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import CreateBtnIcon from 'components/Icons/createBtn';

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
  STATUS_CHANGE_REQUESTED,
} from 'utils/constants';

import { ToDo, InProgress, Done, InReview, Proposal, Approved, Rejected } from '../../../Icons';
import { ColumnSection } from '../../ColumnSection';
import {
  TaskColumnContainer,
  TaskColumnContainerHeader,
  TaskColumnContainerHeaderTitle,
  TaskColumnContainerCount,
  DropMeHere,
  TaskColumnDropContainer,
  TaskListContainer,
} from './styles';
import { Task } from '../../Task';

import { DropZone } from '../../../Icons/dropZone';
import Milestone from '../../Milestone';
import { useMe } from '../../../Auth/withAuth';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import CreateBtnIconDark from 'components/Icons/createBtnIconDark';
import CreateLayoutBaseModal from 'components/CreateEntity/createEntityModal';
import { CreateModalOverlay } from 'components/CreateEntity/styles';

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
  //PROPOSALS
  [STATUS_OPEN]: 'Open',
  [STATUS_APPROVED]: 'Approved',
  [STATUS_CHANGE_REQUESTED]: 'Rejected',
};

const HEADER_ICONS = {
  [TASK_STATUS_TODO]: ToDo,
  [TASK_STATUS_IN_PROGRESS]: InProgress,
  [TASK_STATUS_IN_REVIEW]: InReview,
  [TASK_STATUS_DONE]: Done,
  [STATUS_OPEN]: Proposal,
  [STATUS_APPROVED]: Approved,
  [STATUS_CHANGE_REQUESTED]: Rejected,
};

const TaskColumn = (props: ITaskColumn) => {
  const { cardsList, moveCard, status, section } = props;
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const [openTaskModal, setOpenTaskModal] = useState(false);

  const board = orgBoard || userBoard || podBoard;
  const taskCount = board?.taskCount;
  const HeaderIcon = HEADER_ICONS[status];
  let number;

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
    default:
      number = 0;
      break;
  }

  return (
    <TaskColumnContainer activeEntityType={board?.entityType || ''}>
      <CreateModalOverlay
        style={{
          height: '95vh',
        }}
        open={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
      >
        <CreateLayoutBaseModal
          entityType={ENTITIES_TYPES.TASK}
          handleClose={() => setOpenTaskModal(false)}
          resetEntityType={() => {}}
          setEntityType={() => {}}
          open={openTaskModal}
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
        {status === TASK_STATUS_TODO && (
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
            {cardsList.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    style={{
                      width: '100%',
                    }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                  >
                    {card.type === ENTITIES_TYPES.MILESTONE && !card.isProposal ? (
                      <Milestone>
                        <Task task={card} setTask={() => {}} />
                      </Milestone>
                    ) : (
                      <Task task={card} setTask={() => {}} />
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </TaskListContainer>
        )}
      </Droppable>
    </TaskColumnContainer>
  );
};

export default TaskColumn;
