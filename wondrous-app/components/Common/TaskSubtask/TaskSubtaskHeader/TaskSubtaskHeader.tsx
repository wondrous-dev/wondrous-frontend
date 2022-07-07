import { CreateEntity } from 'components/CreateEntity';
import { useState } from 'react';
import { ENTITIES_TYPES, PERMISSIONS } from 'utils/constants';

import {
  TaskSubtaskHeaderButton,
  TaskSubtaskHeaderButtonIcon,
  TaskSubtaskHeaderButtonIconWrapper,
  TaskSubtaskHeaderButtonLabel,
  TaskSubtaskHeaderWrapper,
} from './styles';

export const TaskSubtaskHeader = ({ taskId, permissions, parentTask }) => {
  const canCreateSubtask =
    permissions.includes(PERMISSIONS.CREATE_TASK) || permissions.includes(PERMISSIONS.FULL_ACCESS);
  const [createFormModal, setCreateFormModal] = useState(false);
  const toggleCreateFormModal = () => setCreateFormModal((prevState) => !prevState);
  return (
    <TaskSubtaskHeaderWrapper>
      <CreateEntity
        entityType={parentTask?.type === ENTITIES_TYPES.BOUNTY ? ENTITIES_TYPES.BOUNTY : ENTITIES_TYPES.TASK}
        handleCloseModal={toggleCreateFormModal}
        open={createFormModal}
        cancel={toggleCreateFormModal}
        handleClose={toggleCreateFormModal}
      />
      {canCreateSubtask && (
        <TaskSubtaskHeaderButton onClick={toggleCreateFormModal}>
          <TaskSubtaskHeaderButtonIconWrapper>
            <TaskSubtaskHeaderButtonIcon fill="#ccbbff" />
          </TaskSubtaskHeaderButtonIconWrapper>
          <TaskSubtaskHeaderButtonLabel>Add task</TaskSubtaskHeaderButtonLabel>
        </TaskSubtaskHeaderButton>
      )}
    </TaskSubtaskHeaderWrapper>
  );
};
