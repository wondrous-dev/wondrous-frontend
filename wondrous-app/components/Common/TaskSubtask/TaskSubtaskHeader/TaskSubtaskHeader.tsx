import { CreateEntity } from 'components/CreateEntity';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import {
  TaskSubtaskHeaderButton,
  TaskSubtaskHeaderButtonIcon,
  TaskSubtaskHeaderButtonIconWrapper,
  TaskSubtaskHeaderButtonLabel,
  TaskSubtaskHeaderWrapper,
} from './styles';

export function TaskSubtaskHeader({ taskId, canCreate }) {
  const [createFormModal, setCreateFormModal] = useState(false);
  const toggleCreateFormModal = () => setCreateFormModal((prevState) => !prevState);
  if (!canCreate) return null;
  return (
    <TaskSubtaskHeaderWrapper>
      <CreateEntity
        entityType={ENTITIES_TYPES.TASK}
        handleCloseModal={toggleCreateFormModal}
        open={createFormModal}
        cancel={toggleCreateFormModal}
        handleClose={toggleCreateFormModal}
        parentTaskId={taskId}
      />
      <TaskSubtaskHeaderButton onClick={toggleCreateFormModal}>
        <TaskSubtaskHeaderButtonIconWrapper>
          <TaskSubtaskHeaderButtonIcon fill="#ccbbff" />
        </TaskSubtaskHeaderButtonIconWrapper>
        <TaskSubtaskHeaderButtonLabel>Add subtask</TaskSubtaskHeaderButtonLabel>
      </TaskSubtaskHeaderButton>
    </TaskSubtaskHeaderWrapper>
  );
}
