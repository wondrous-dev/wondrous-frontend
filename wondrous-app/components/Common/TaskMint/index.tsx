import { useMemo, useState } from 'react';
import { TaskMintStatus, TASK_STATUS_DONE } from 'utils/constants';
import { useMe } from 'components/Auth/withAuth';
import { TaskMint } from 'types/task';
import TaskMintButton from './TaskMintButton';
import Modals from './Modals';
import MintViewAndShare from './MintViewAndShare';

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
  isMilestone?: boolean;
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
  isMilestone,
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

  if (taskStatus !== TASK_STATUS_DONE || (user?.id !== assigneeId && !canMintBounty) || isMilestone) {
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
