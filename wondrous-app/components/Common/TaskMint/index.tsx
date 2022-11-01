import { useState } from 'react';
import { TaskMintStatus, TASK_STATUS_DONE } from 'utils/constants';
import { useMe } from 'components/Auth/withAuth';
import { TaskMint } from 'types/task';
import TaskMintButton from './TaskMintButton';
import Modals from './Modals';
import OpenseaButton from './OpenseaButton';

interface Props {
  taskMintData: TaskMint;
  taskStatus: string;
  assigneeId?: string;
}

const TaskMintComponent = ({ taskMintData, taskStatus, assigneeId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tokenId, status } = taskMintData;
  const user = useMe();

  if (status === TaskMintStatus.COMPLETED) {
    return <OpenseaButton tokenId={tokenId} />;
  }

  if (taskStatus !== TASK_STATUS_DONE || user?.id !== assigneeId) {
    return null;
  }

  const toggleModal = () => setIsModalOpen((prevState) => !prevState);
  return (
    <>
      <Modals isOpen={isModalOpen} onClose={toggleModal} />
      <TaskMintButton onClick={toggleModal} status={status} />
    </>
  );
};

export default TaskMintComponent;
