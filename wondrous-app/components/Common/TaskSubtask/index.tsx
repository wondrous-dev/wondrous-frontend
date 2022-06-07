import { CreateEntity } from 'components/CreateEntity';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
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
      <CreateEntity
        open={createFormModal}
        handleCloseModal={toggleCreateFormModal}
        entityType={ENTITIES_TYPES.TASK}
        handleClose={toggleCreateFormModal}
        parentTaskId={taskId}
        cancel={toggleCreateFormModal}
      />
      <Subtask>
        <TaskSubtaskHeader taskId={taskId} permissions={permissions} onClick={toggleCreateFormModal} />
        <TaskSubtaskList taskId={taskId} />
      </Subtask>
    </>
  );
};
