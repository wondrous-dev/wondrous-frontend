import { useState } from 'react';
import {
  AddTaskButton,
  EmptyStatePlaceholder,
  EmptyStateWrapper,
  AddTaskPlusIcon,
  UserRoleInfo,
  NoPermissionToCreateWrapper,
  UserRoleInfoHighlight,
} from './styles';
import {
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_REVIEW,
  STATUS_OPEN,
} from 'utils/constants';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { canUserCreateTask } from 'utils/helpers';
import {
  EmptyStateTodoIcon,
  EmptyStateInProgressIcon,
  EmptyStateInReviewIcon,
  EmptyStateCompletedIcon,
} from 'components/Icons/emptyStates';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import { CreateEntityModal } from 'components/CreateEntity/CreateEntityModal';
import { ENTITIES_UI_ELEMENTS } from 'components/CreateEntity/chooseEntityToCreateModal';
interface Props {
  status: string;
  hidePlaceholder?: boolean;
  fullWidth?: boolean;
}

const ICONS_MAP = {
  [TASK_STATUS_TODO]: EmptyStateTodoIcon,
  [TASK_STATUS_IN_PROGRESS]: EmptyStateInProgressIcon,
  [TASK_STATUS_IN_REVIEW]: EmptyStateInReviewIcon,
  [TASK_STATUS_DONE]: EmptyStateCompletedIcon,
};
const STATUSES_WITH_ADD_TASK_BUTTON = [TASK_STATUS_IN_PROGRESS, TASK_STATUS_TODO, TASK_STATUS_IN_REVIEW, STATUS_OPEN];

const EmptyStateBoards = ({ status, hidePlaceholder, fullWidth }: Props) => {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard || userBoard;
  const userPermissionsContext = board?.userPermissionsContext;

  const canCreateTask = canUserCreateTask(userPermissionsContext, board?.orgId, board?.podId);

  const shouldDisplayAddTaskButton = canCreateTask && STATUSES_WITH_ADD_TASK_BUTTON.includes(status);

  const statusToDisplayNoRoleCard =
    board?.columns?.find((column) => column?.tasks?.length === 0 && column?.status !== TASK_STATUS_DONE)?.status ||
    TASK_STATUS_TODO;

  const orgRole = orgBoard && userPermissionsContext?.orgRoles[board?.orgId];

  const podRole = podBoard && userPermissionsContext?.podRoles[board?.orgId];

  const role = orgRole || podRole;

  const handleTaskModal = () => setOpenTaskModal((prevState) => !prevState);

  const entityLabel = ENTITIES_UI_ELEMENTS[board?.entityType]?.label;
  return (
    <>
      <CreateModalOverlay
        style={{
          height: '95vh',
        }}
        open={openTaskModal}
        onClose={handleTaskModal}
      >
        <CreateEntityModal
          entityType={board?.entityType}
          handleClose={handleTaskModal}
          resetEntityType={() => {}}
          setEntityType={() => {}}
          cancel={handleTaskModal}
        />
      </CreateModalOverlay>

      <EmptyStateWrapper fullWidth={fullWidth}>
        {shouldDisplayAddTaskButton ? (
          <>
            <AddTaskButton onClick={handleTaskModal}>
              <AddTaskPlusIcon />
              Add {entityLabel}
            </AddTaskButton>
          </>
        ) : null}
        {!canCreateTask && status === statusToDisplayNoRoleCard ? (
          <NoPermissionToCreateWrapper>
            <UserRoleInfoHighlight>
              {role ? (
                <>
                  You are a <span>{role}</span> in this org.
                </>
              ) : null}
            </UserRoleInfoHighlight>
            <UserRoleInfo>You need to have a role that can create {entityLabel}</UserRoleInfo>
          </NoPermissionToCreateWrapper>
        ) : null}
        {!hidePlaceholder && <EmptyStatePlaceholder>{ICONS_MAP[status]()}</EmptyStatePlaceholder>}
      </EmptyStateWrapper>
    </>
  );
};

export default EmptyStateBoards;
