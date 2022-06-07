import { CreateEntityModal } from 'components/CreateEntity/CreateEntityModal';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import CreateLayoutBaseModal from '../../CreateEntity/createEntityModal';
import { CreateModalOverlay } from '../../CreateEntity/styles';
import { TaskSubtaskHeader } from '../TaskSubtaskHeader';
import { TaskSubtaskList } from '../TaskSubtaskList';
import { Subtask } from './styles';

export const TaskSubtasks = ({ taskId, permissions }) => {
  const [createFormModal, setCreateFormModal] = useState(false);

  const toggleCreateFormModal = () => {
    setCreateFormModal((prevState) => !prevState);
  };

  return (
    <>
      <CreateModalOverlay open={createFormModal} onClose={toggleCreateFormModal}>
        <CreateEntityModal
          entityType={ENTITIES_TYPES.TASK}
          handleClose={toggleCreateFormModal}
          parentTaskId={taskId}
          cancel={toggleCreateFormModal}
        />
      </CreateModalOverlay>
      <Subtask>
        <TaskSubtaskHeader taskId={taskId} permissions={permissions} onClick={toggleCreateFormModal} />
        <TaskSubtaskList taskId={taskId} />
      </Subtask>
    </>
  );
};
