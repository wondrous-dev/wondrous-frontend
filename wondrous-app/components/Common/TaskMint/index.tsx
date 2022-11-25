import { useState } from 'react';
import { TaskMintStatus, TASK_STATUS_DONE } from 'utils/constants';
import { useMe } from 'components/Auth/withAuth';
import { TaskMint } from 'types/task';
import TaskMintButton from './TaskMintButton';
import Modals from './Modals';
import OpenseaButton from './OpenseaButton';
import TaskViewMintActions from './TaskMintViewActions';

interface Props {
  taskMintData: TaskMint;
  taskStatus: string;
  assigneeId?: string;
  setIsViewNft?: (mode: boolean) => void;
  isViewNft?: boolean;
  taskId?: string;
  tokenData?: any;
}

const TaskMintComponent = ({ taskMintData, taskStatus, assigneeId, setIsViewNft, isViewNft, taskId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tokenId = taskMintData?.tokenId;
  const status = taskMintData?.status;
  console.log(taskMintData, 'task mint data');
  const user = useMe();

  if (taskStatus !== TASK_STATUS_DONE || user?.id !== assigneeId) {
    return null;
  }

  const toggleModal = () => setIsModalOpen((prevState) => !prevState);

  const handleMintButtonClick = () => (status === TaskMintStatus.COMPLETED ? setIsViewNft(true) : toggleModal());

  if (process.env.NEXT_PUBLIC_PRODUCTION) return null;

  return (
    <>
      <Modals isOpen={isModalOpen} onClose={toggleModal} />

      {isViewNft ? (
        <TaskViewMintActions tokenId={tokenId} taskId={taskId} />
      ) : (
        <TaskMintButton onClick={handleMintButtonClick} status={status} />
      )}
    </>
  );
};

export default TaskMintComponent;
