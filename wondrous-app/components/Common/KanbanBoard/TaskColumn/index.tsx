import React, { useContext, useEffect, useMemo, useState } from 'react';
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
  ANALYTIC_EVENTS,
  CLOSE_AI_SNACK_BAR,
  CLOSE_TASK_TEMPLATE_SNACK_BAR,
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

import { IsMobileContext } from 'utils/contexts';
import { hasCreateTaskPermission } from 'utils/helpers';
import { useQuery } from '@apollo/client';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useRouter } from 'next/router';

import { useMe } from 'components/Auth/withAuth';
import {
  TaskColumnContainer,
  TaskColumnContainerHeader,
  TaskColumnContainerHeaderTitle,
  TaskColumnContainerCount,
  TaskListContainer,
  TaskColumnItemWrapper,
  AISnackbarContainer,
  AISnackbarNewContainer,
  AISnackbarText,
} from './styles';
import CrossSvg from './images/cross.svg';

interface ITaskColumn {
  cardsList: Array<any>;
  moveCard: any;
  status: string;
  draggingTask: TaskInterface | null;
}

function TaskColumn(props: ITaskColumn) {
  const { cardsList, status, draggingTask } = props;
  const router = useRouter();
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const user = useMe();
  const [AISnackbarVisible, setAISnackbarVisible] = useState(true);
  const [openFromTemplate, setOpenFromTemplate] = useState(false);
  const [taskTemplateSnackbarVisible, setTaskTemplateSnackbarVisible] = useState(true);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(false);
  const [ref, inView] = useInView({});
  const isMobile = useContext(IsMobileContext);
  const board = orgBoard || podBoard || userBoard;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const permissions = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;
  const isTaskDragging = useMemo(() => draggingTask !== null, [draggingTask]);
  const isDropDisabled = useMemo(
    () => isTaskDragging && taskHasPayment(draggingTask) && status !== TASK_STATUS_DONE,
    [draggingTask, isTaskDragging, status]
  );

  const canCreateTask =
    hasCreateTaskPermission({ userPermissionsContext: permissions, orgId: board?.orgId, podId: board?.podId }) ||
    board?.entityType === ENTITIES_TYPES.PROPOSAL ||
    userBoard;

  const taskCount = board?.taskCount;
  const HeaderIcon = HEADER_ICONS[status];
  let number;

  const closeAISnackbar = localStorage.getItem(CLOSE_AI_SNACK_BAR);
  const closeTaskTemplateSnackbar = localStorage.getItem(CLOSE_TASK_TEMPLATE_SNACK_BAR);
  useEffect(() => {
    if (closeAISnackbar) {
      setAISnackbarVisible(false);
    }
  }, [closeAISnackbar]);

  useEffect(() => {
    if (closeTaskTemplateSnackbar) {
      setTaskTemplateSnackbarVisible(false);
    }
  }, [closeTaskTemplateSnackbar]);
  useEffect(() => {
    if (inView && board?.hasMore && LIMIT <= cardsList.length) {
      board?.onLoadMore();
    }
  }, [inView, board?.hasMore]);

  let taskColumnWidth = '100%';
  if (!userBoard) {
    taskColumnWidth = isMobile ? '100%' : '25%';
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
      taskColumnWidth = isMobile ? '100%' : '33.3%';
      break;
    case STATUS_APPROVED:
      number = taskCount?.proposalApproved || 0;
      taskColumnWidth = isMobile ? '100%' : '33.3%';
      break;
    case STATUS_CLOSED:
      number = taskCount?.proposalClosed || 0;
      taskColumnWidth = isMobile ? '100%' : '33.3%';
      break;
    default:
      number = 0;
      break;
  }

  return (
    <TaskColumnContainer
      onMouseEnter={() => status === TASK_STATUS_TODO && canCreateTask && setIsAddButtonVisible(true)}
      onMouseLeave={() => status === TASK_STATUS_TODO && setIsAddButtonVisible(false)}
      activeEntityType={board?.entityType || ''}
      style={{
        width: taskColumnWidth,
        minWidth: '266px',
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
          shouldShowTemplates={openFromTemplate}
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
      {status === TASK_STATUS_TODO && canCreateTask && AISnackbarVisible && (orgBoard || podBoard) && (
        <AISnackbarContainer
          onClick={() => {
            if (window?.analytics && process.env.NEXT_PUBLIC_PRODUCTION) {
              window?.analytics?.track(ANALYTIC_EVENTS.AI_CREATE_TASK_SNACKBAR_CLICK, {
                orgId: board?.orgId,
                podId: board?.podId,
                userId: user?.id,
              });
            }
            if (orgBoard) {
              router.push(`/organization/${orgBoard?.orgData?.username}/wonder_ai_bot`, undefined, { shallow: true });
            } else if (podBoard) {
              router.push(`/pod/${podBoard?.podId}/wonder_ai_bot`, undefined, { shallow: true });
            }
          }}
        >
          <AISnackbarNewContainer>
            <AISnackbarText>New!</AISnackbarText>
          </AISnackbarNewContainer>
          <AISnackbarText
            style={{
              marginLeft: '8px',
            }}
          >
            Generate tasks with AI
          </AISnackbarText>
          <div
            style={{
              flex: 1,
            }}
          />
          <CrossSvg
            style={{
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              localStorage.setItem(CLOSE_AI_SNACK_BAR, 'true');
              setAISnackbarVisible(false);
            }}
          />
        </AISnackbarContainer>
      )}
      {status === TASK_STATUS_TODO && canCreateTask && taskTemplateSnackbarVisible && (orgBoard || podBoard) && (
        <AISnackbarContainer
          onClick={() => {
            console.log('analytics', window?.analytics, process.env.NEXT_PUBLIC_PRODUCTION);
            if (window?.analytics && process.env.NEXT_PUBLIC_PRODUCTION) {
              console.log('getting in here?');
              window?.analytics?.track(ANALYTIC_EVENTS.CREATE_TASK_FROM_TASK_TEMPLATE_SNACKBAR_CLICK, {
                orgId: board?.orgId,
                podId: board?.podId,
                userId: user?.id,
              });
            }
            setOpenFromTemplate(true);
            setOpenTaskModal(true);
          }}
        >
          <AISnackbarNewContainer>
            <AISnackbarText>New!</AISnackbarText>
          </AISnackbarNewContainer>
          <AISnackbarText
            style={{
              marginLeft: '8px',
            }}
          >
            Start from a template?
          </AISnackbarText>
          <div
            style={{
              flex: 1,
            }}
          />
          <CrossSvg
            style={{
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              localStorage.setItem(CLOSE_TASK_TEMPLATE_SNACK_BAR, 'true');
              setTaskTemplateSnackbarVisible(false);
            }}
          />
        </AISnackbarContainer>
      )}
      <Droppable droppableId={status} isDropDisabled={isDropDisabled}>
        {(provided) => (
          <TaskListContainer
            highlighted={isTaskDragging && !isDropDisabled}
            ref={provided.innerRef}
            isMobile={isMobile}
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
                      {board?.entityType === ENTITIES_TYPES.MILESTONE && !card.isProposal ? (
                        <Milestone>
                          <Task task={card} isMilestone />
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
