import { useMe } from 'components/Auth/withAuth';
import { useMemo, useState } from 'react';
import { TaskMint } from 'types/task';
import { TaskMintStatus, TASK_STATUS_DONE } from 'utils/constants';
import MintViewAndShare from './MintViewAndShare';
import Modals from './Modals';
import TaskMintButton from './TaskMintButton';

interface Props {
  taskMintData: TaskMint;
  taskStatus: string;
  assigneeId?: string;
  setIsViewNft?: (mode: boolean) => void;
  isViewNft?: boolean;
  taskId?: string;
  tokenData?: any;
  taskSubmissionsForTask?: any;
  isBounty?: boolean;
}

const TaskMintComponent = ({
  taskMintData,
  taskStatus,
  assigneeId,
  setIsViewNft,
  isViewNft,
  taskId,
  taskSubmissionsForTask,
  isBounty,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tokenId = taskMintData?.tokenId;
  const status = taskMintData?.status;
  const user = useMe();

  const canMintBounty = useMemo(() => {
    if (!isBounty) return true;
    const submissions = taskSubmissionsForTask?.getTaskSubmissionsForTask;
    const submission = submissions?.find((submission) => submission?.approvedAt && submission?.createdBy === user?.id);
    return !!submission;
  }, [isBounty, taskSubmissionsForTask]);

  if (taskStatus !== TASK_STATUS_DONE || (user?.id !== assigneeId && !canMintBounty)) {
    return null;
  }

  const toggleModal = () => setIsModalOpen((prevState) => !prevState);

  const handleMintButtonClick = () => (status === TaskMintStatus.COMPLETED ? setIsViewNft(true) : toggleModal());

  return (
    <>
      <Modals isOpen={isModalOpen} onClose={toggleModal} />

      {isViewNft ? (
        <MintViewAndShare tokenId={tokenId} taskId={taskId} />
      ) : (
        <TaskMintButton onClick={handleMintButtonClick} status={status} />
      )}
    </>
  );
};

export default TaskMintComponent;
