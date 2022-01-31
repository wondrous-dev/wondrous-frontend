import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';

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
import DraggableCard, { ItemTypes } from './DraggableCard';
import { ColumnSection } from '../../ColumnSection';

import {
  TaskColumnContainer,
  TaskColumnContainerHeader,
  TaskColumnContainerHeaderTitle,
  TaskColumnContainerCount,
  DropMeHere,
  TaskColumnDropContainer,
} from './styles';
import { Task } from '../../Task';

import { DropZone } from '../../../Icons/dropZone';
import Milestone from '../../Milestone';
import { useMe } from '../../../Auth/withAuth';
import { useOrgBoard, usePodBoard, useUserBoard } from '../../../../utils/hooks';
import { parseUserPermissionContext } from '../../../../utils/helpers';

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
};

const HEADER_ICONS = {
  [TASK_STATUS_TODO]: ToDo,
  [TASK_STATUS_IN_PROGRESS]: InProgress,
  // [TASK_STATUS_IN_REVIEW]: InReview,
  [TASK_STATUS_DONE]: Done,
};

const ColumnDropZone = ({ status, moveCard, children }) => {
  const ref = useRef(null);
  const user = useMe();

  // Permissions for Draggable context
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || userBoard || podBoard;
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop(item: any) {
      // Return card to its place if not permitted
      if (checkPermissions(item)) {
        moveCard(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

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

    // Only if user exists.
    return canEdit && user && task;
  };

  drop(ref);

  return (
    <TaskColumnDropContainer ref={ref}>
      {isOver && (
        <DropMeHere>
          <DropZone />
          <p>Drag task here</p>
        </DropMeHere>
      )}
      {children}
    </TaskColumnDropContainer>
  );
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
        <HeaderIcon />
        <TaskColumnContainerHeaderTitle>{TITLES[status]}</TaskColumnContainerHeaderTitle>
        <TaskColumnContainerCount>{number}</TaskColumnContainerCount>
      </TaskColumnContainerHeader>
      <ColumnSection section={section} setSection={() => {}} />

      {cardsList.map((card, index) => (
        <DraggableCard
          key={card.id}
          id={card.id}
          assigneeId={card.assigneeId}
          createdBy={card.createdBy}
          orgId={card.orgId}
          podId={card.podId}
          status={card.status}
          moveCard={moveCard}
          index={index}
          boardType={boardType}
          tasks={cardsList}
        >
          {card.type === ENTITIES_TYPES.MILESTONE ? (
            <Milestone>
              <Task task={card} setTask={() => {}} />
            </Milestone>
          ) : (
            <Task task={card} setTask={() => {}} />
          )}
        </DraggableCard>
      ))}
      {
        <ColumnDropZone moveCard={moveCard} status={status}>
          <div style={{ width: '325px', height: '100%' }} />
        </ColumnDropZone>
      }
    </TaskColumnContainer>
  );
};

export default TaskColumn;
