import { useState } from 'react';
import { ENTITIES_TYPES } from '../../../utils/constants';
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
        <CreateLayoutBaseModal
          entityType={ENTITIES_TYPES.TASK}
          open={createFormModal}
          handleClose={toggleCreateFormModal}
          parentTaskId={taskId}
        />
      </CreateModalOverlay>
      <Subtask>
        <TaskSubtaskHeader taskId={taskId} permissions={permissions} onClick={toggleCreateFormModal} />
        <TaskSubtaskList taskId={taskId} />
      </Subtask>
    </>
  );
};
