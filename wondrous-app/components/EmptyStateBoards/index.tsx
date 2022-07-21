import {
  AddTaskButton,
  EmptyStatePlaceholder,
  EmptyStateWrapper,
  AddTaskPlusIcon,
  UserRoleInfo,
  NoPermissionToCreateWrapper,
  UserRoleInfoHighlight,
} from './styles';
import { TASK_STATUS_IN_PROGRESS, TASK_STATUS_TODO, TASK_STATUS_DONE, TASK_STATUS_IN_REVIEW } from 'utils/constants';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { canUserCreateTask } from 'utils/helpers';
import {
  EmptyStateTodoIcon,
  EmptyStateInProgressIcon,
  EmptyStateInReviewIcon,
  EmptyStateCompletedIcon,
} from 'components/Icons/emptyStates';

interface Props {
  status: string;
  setOpenTaskModal: (boolean) => any;
}

const ICONS_MAP = {
  [TASK_STATUS_TODO]: EmptyStateTodoIcon,
  [TASK_STATUS_IN_PROGRESS]: EmptyStateInProgressIcon,
  [TASK_STATUS_IN_REVIEW]: EmptyStateInReviewIcon,
  [TASK_STATUS_DONE]: EmptyStateCompletedIcon,
};
const STATUSES_WITH_ADD_TASK_BUTTON = [TASK_STATUS_IN_PROGRESS, TASK_STATUS_TODO, TASK_STATUS_IN_REVIEW];

const EmptyStateBoards = ({ status, setOpenTaskModal }: Props) => {
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard || userBoard;
  const userPermissionsContext = board?.userPermissionsContext;

  const canCreateTask = canUserCreateTask(userPermissionsContext, board?.orgId, board?.podId);

  const shouldDisplayAddTaskButton = canCreateTask && STATUSES_WITH_ADD_TASK_BUTTON.includes(status);

  const openTaskModal = () => setOpenTaskModal(true);

  const statusToDisplayNoRoleCard =
    board?.columns?.find((column) => column?.tasks?.length === 0 && column?.status !== TASK_STATUS_DONE)?.status ||
    TASK_STATUS_TODO;

  console.log(userPermissionsContext);
  const orgRole = orgBoard && userPermissionsContext?.orgRoles[board?.orgId];

  const podRole = podBoard && userPermissionsContext?.podRoles[board?.orgId];

  const role = orgRole || podRole;
  return (
    <EmptyStateWrapper>
      {shouldDisplayAddTaskButton ? (
        <>
          <AddTaskButton onClick={openTaskModal}>
            <AddTaskPlusIcon />
            Add task
          </AddTaskButton>{' '}
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
          <UserRoleInfo>You need to have a role that can create tasks</UserRoleInfo>
        </NoPermissionToCreateWrapper>
      ) : null}
      <EmptyStatePlaceholder>{ICONS_MAP[status]()}</EmptyStatePlaceholder>
    </EmptyStateWrapper>
  );
};

export default EmptyStateBoards;
