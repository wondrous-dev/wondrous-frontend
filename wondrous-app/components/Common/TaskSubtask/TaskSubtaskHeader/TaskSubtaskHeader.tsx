import { CreateEntityModal } from 'components/CreateEntity/CreateEntityModal';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import { useState } from 'react';
import { ENTITIES_TYPES, PERMISSIONS } from 'utils/constants';

import { CreateSubtaskButton, CreateSubtaskIcon, StyledPlusIcon, SubtaskHeader } from './styles';

export const TaskSubtaskHeader = ({ taskId, permissions, parentTask }) => {
  const canCreateSubtask =
    permissions.includes(PERMISSIONS.CREATE_TASK) || permissions.includes(PERMISSIONS.FULL_ACCESS);
  const [createFormModal, setCreateFormModal] = useState(false);
  const toggleCreateFormModal = () => setCreateFormModal((prevState) => !prevState);
  return (
    <SubtaskHeader>
      <CreateModalOverlay open={createFormModal} onClose={toggleCreateFormModal}>
        <CreateEntityModal
          entityType={parentTask?.type === ENTITIES_TYPES.BOUNTY ? ENTITIES_TYPES.BOUNTY : ENTITIES_TYPES.TASK}
          handleClose={toggleCreateFormModal}
          parentTaskId={taskId}
          cancel={toggleCreateFormModal}
        />
      </CreateModalOverlay>
      {canCreateSubtask && (
        <CreateSubtaskButton onClick={toggleCreateFormModal}>
          <CreateSubtaskIcon>
            <StyledPlusIcon fill="#ccbbff" />
          </CreateSubtaskIcon>
          Add task
        </CreateSubtaskButton>
      )}
    </SubtaskHeader>
  );
};
