import { AddTaskButton, EmptyStatePlaceholder, EmptyStateWrapper } from './styles';
import { TASK_STATUS_IN_PROGRESS, TASK_STATUS_TODO, TASK_STATUS_DONE, TASK_STATUS_IN_REVIEW } from 'utils/constants';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { canUserCreateTask } from 'utils/helpers';
interface Props {
  status: string;
  setOpenTaskModal: (boolean) => any;
}

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
  return (
    <EmptyStateWrapper>
      {shouldDisplayAddTaskButton ? (
        <>
          <AddTaskButton onClick={openTaskModal}>Add task</AddTaskButton>{' '}
        </>
      ) : null}
      {!canCreateTask && status === statusToDisplayNoRoleCard ? (
        <div style={{ color: 'white' }}>you cant create task</div>
      ) : null}
      <EmptyStatePlaceholder />
    </EmptyStateWrapper>
  );
};

export default EmptyStateBoards;
