import { CreateEntityModal } from 'components/CreateEntity/CreateEntityModal/index';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import CreateLayoutBaseModal from '../../CreateEntity/createEntityModal';
import { CreateModalOverlay } from '../../CreateEntity/styles';
import { TaskSubtaskHeader } from '../TaskSubtaskHeader';
import { TaskSubtaskList } from '../TaskSubtaskList';
import { Subtask } from './styles';

export const TaskSubtasks = ({ taskId, permissions, parentTask }) => {
  const [createFormModal, setCreateFormModal] = useState(false);

  const toggleCreateFormModal = () => {
    setCreateFormModal((prevState) => !prevState);
  };

  return (
    <>
      <CreateModalOverlay open={createFormModal} onClose={toggleCreateFormModal}>
        <CreateEntityModal
          entityType={parentTask?.type === ENTITIES_TYPES.BOUNTY ? ENTITIES_TYPES.BOUNTY : ENTITIES_TYPES.TASK}
          handleClose={toggleCreateFormModal}
          parentTaskId={taskId}
          cancel={toggleCreateFormModal}
        />
      </CreateModalOverlay>
      <Subtask>
        {taskId && <TaskSubtaskHeader taskId={taskId} permissions={permissions} onClick={toggleCreateFormModal} />}
        {taskId && <TaskSubtaskList taskId={taskId} />}
      </Subtask>
    </>
  );
};
