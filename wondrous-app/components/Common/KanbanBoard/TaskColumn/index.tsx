import React, { useRef } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import {
  PERMISSIONS,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_TODO,
  ENTITIES_TYPES,
  BOARD_TYPE,
} from '../../../../utils/constants';

import { ToDo, InProgress, Done } from '../../../Icons';
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
import { useOrgBoard, usePodBoard, useUserBoard } from '../../../../utils/hooks';
import { parseUserPermissionContext } from '../../../../utils/helpers';
import Tooltip from '../../Popover';

interface ITaskColumn {
  cardsList: Array<any>;
  moveCard: any;
  status: string;
  section: Array<any>;
  onOpen: () => any;
}

const TITLES = {
  [TASK_STATUS_TODO]: { label: 'To-do', placeholder: 'To-Do' },
  [TASK_STATUS_IN_PROGRESS]: { label: 'In-Progress', placeholder: 'In-Progress' },
  [TASK_STATUS_IN_REVIEW]: { label: 'In-Review', placeholder: 'In-Review' },
  [TASK_STATUS_DONE]: { label: 'Done', placeholder: 'Completed' },
};

const HEADER_ICONS = {
  [TASK_STATUS_TODO]: ToDo,
  [TASK_STATUS_IN_PROGRESS]: InProgress,
  // [TASK_STATUS_IN_REVIEW]: InReview,
  [TASK_STATUS_DONE]: Done,
};

const TaskColumn = (props: ITaskColumn) => {
  const { cardsList, moveCard, status, section } = props;
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  let boardType = null;
  if (orgBoard) {
    boardType = BOARD_TYPE.org;
  } else if (podBoard) {
    boardType = BOARD_TYPE.pod;
  } else if (userBoard) {
    boardType = BOARD_TYPE.assignee;
  }

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
      number = taskCount?.submission || 0;
      break;
    default:
      number = 0;
      break;
  }

  return (
    <TaskColumnContainer>
      <TaskColumnContainerHeader>
        <Tooltip content={TITLES[status].placeholder}>
          <HeaderIcon />
        </Tooltip>
        <TaskColumnContainerHeaderTitle>{TITLES[status].label}</TaskColumnContainerHeaderTitle>
        <TaskColumnContainerCount>{number}</TaskColumnContainerCount>
      </TaskColumnContainerHeader>
      <ColumnSection section={section} setSection={() => {}} />
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
                    {card.type === ENTITIES_TYPES.MILESTONE ? (
                      <Milestone>
                        <Task onOpen={props.onOpen} task={card} setTask={() => {}} />
                      </Milestone>
                    ) : (
                      <Task onOpen={props.onOpen} task={card} setTask={() => {}} />
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
