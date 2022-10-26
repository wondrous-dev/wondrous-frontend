import { useState } from 'react';
import { TASK_STATUS_DONE } from 'utils/constants';
import { useMe } from 'components/Auth/withAuth';
import TaskMintButton from './TaskMintButton';
import Modals from './Modals';
import OpenseaButton from './OpenseaButton';

const TaskMintComponent = ({ tokenId, taskStatus, assigneeId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useMe();

  if (taskStatus !== TASK_STATUS_DONE || user?.id !== assigneeId) {
    return null;
  }

  if (tokenId) {
    return <OpenseaButton tokenId={tokenId} />;
  }
  const toggleModal = () => setIsModalOpen((prevState) => !prevState);
  return (
    <>
      <Modals isOpen={isModalOpen} onClose={toggleModal} />
      <TaskMintButton onClick={toggleModal} />
    </>
  );
};

export default TaskMintComponent;
