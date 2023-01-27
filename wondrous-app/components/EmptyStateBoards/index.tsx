import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import {
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_REVIEW,
  STATUS_OPEN,
  ENTITIES_TYPES,
} from 'utils/constants';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { useMe } from 'components/Auth/withAuth';
import { hasCreateTaskPermission } from 'utils/helpers';
import {
  EmptyStateTodoIcon,
  EmptyStateInProgressIcon,
  EmptyStateInReviewIcon,
  EmptyStateCompletedIcon,
} from 'components/Icons/emptyStates';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import CreateEntityModal from 'components/CreateEntity/CreateEntityModal';
import { ENTITIES_UI_ELEMENTS } from 'components/CreateEntity/chooseEntityToCreateModal';
import { HeaderButton } from 'components/organization/wrapper/styles';
import {
  AddTaskButton,
  EmptyStatePlaceholder,
  EmptyStateWrapper,
  AddTaskPlusIcon,
  UserRoleInfo,
  NoPermissionToCreateWrapper,
  UserRoleInfoHighlight,
} from './styles';

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

function EmptyStateBoards({ status, hidePlaceholder, fullWidth }: Props) {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const router = useRouter();
  const board = orgBoard || podBoard || userBoard;
  const [entityType, setEntityType] = useState(board?.entityType);
  const user = useMe();
  const userPermissionsContext = board?.userPermissionsContext;

  // we want to be able to create proposals from the tasks list for users who cannot create tasks
  useEffect(() => {
    entityType !== board?.entityType && setEntityType(board?.entityType);
  }, [board?.entityType]);

  const canCreateTask =
    hasCreateTaskPermission({ userPermissionsContext, orgId: board?.orgId, podId: board?.podId }) ||
    board?.entityType === ENTITIES_TYPES.PROPOSAL ||
    userBoard;

  const shouldDisplayAddTaskButton = canCreateTask && STATUSES_WITH_ADD_TASK_BUTTON.includes(status);

  const statusToDisplayNoRoleCard =
    board?.columns?.find((column) => column?.tasks?.length === 0 && column?.status !== TASK_STATUS_DONE)?.status ||
    TASK_STATUS_TODO;

  const orgRole = orgBoard && userPermissionsContext?.orgRoles[board?.orgId];

  const podRole = podBoard && userPermissionsContext?.podRoles[board?.podId];

  const role = orgRole || podRole;

  const handleTaskModal = () => {
    setOpenTaskModal((prevState) => !prevState);
  };

  const entityLabel = ENTITIES_UI_ELEMENTS[board?.entityType]?.label;

  const handleRedirect = () => router.push('/login', undefined, { shallow: true });

  const IconComponent = ICONS_MAP[status];

  const handleProposalCreate = () => {
    setEntityType(ENTITIES_TYPES.PROPOSAL);
    handleTaskModal();
  };
  const boardTypeTitle = orgBoard ? 'org' : 'pod';
  return (
    <>
      <CreateModalOverlay open={openTaskModal} onClose={handleTaskModal}>
        <CreateEntityModal
          entityType={entityType || ENTITIES_TYPES.TASK}
          handleClose={handleTaskModal}
          resetEntityType={() => {}}
          setEntityType={() => {}}
          status={status}
          cancel={handleTaskModal}
        />
      </CreateModalOverlay>

      <EmptyStateWrapper fullWidth={fullWidth}>
        {shouldDisplayAddTaskButton ? (
          <AddTaskButton onClick={handleTaskModal} fullWidth={fullWidth}>
            <AddTaskPlusIcon />
            Add {entityLabel}
          </AddTaskButton>
        ) : null}
        {!canCreateTask && status === statusToDisplayNoRoleCard ? (
          <NoPermissionToCreateWrapper>
            {user ? (
              <>
                {role && (
                  <UserRoleInfoHighlight>
                    You are a <span>{role}</span> in this {boardTypeTitle}.
                  </UserRoleInfoHighlight>
                )}
                <UserRoleInfo>{`You can't create a ${entityLabel}, ${
                  role ? 'but you can create a Proposal' : `you need to be a member of this ${boardTypeTitle}`
                }`}</UserRoleInfo>
                {role && (
                  <HeaderButton type="button" onClick={handleProposalCreate} reversed>
                    Create proposal
                  </HeaderButton>
                )}
              </>
            ) : (
              <>
                <UserRoleInfo>You need to be signed in to create a {entityLabel}.</UserRoleInfo>
                <HeaderButton type="button" onClick={handleRedirect} reversed>
                  Sign in
                </HeaderButton>
              </>
            )}
          </NoPermissionToCreateWrapper>
        ) : null}
        {!hidePlaceholder && <EmptyStatePlaceholder>{IconComponent ? <IconComponent /> : null}</EmptyStatePlaceholder>}
      </EmptyStateWrapper>
    </>
  );
}

export default EmptyStateBoards;
