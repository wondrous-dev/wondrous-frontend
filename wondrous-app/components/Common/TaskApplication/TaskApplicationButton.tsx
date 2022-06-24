import { useState, useEffect } from 'react';
import { ActionButton } from 'components/Common/Task/styles';
import { Claim } from 'components/Icons/claimTask';
import { useLazyQuery } from '@apollo/client';
import TaskApplicationModal from './TaskApplicationFormModal';
interface Props {
  task: any;
  canApply: boolean;
  title?: string;
}

export default function TaskApplicationButton({ task, canApply, title = 'Apply' }: Props) {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleButtonClick = () => setIsConfirmationModalOpen(true);

  const handleClose = () => setIsConfirmationModalOpen(false);

  const handleSubmit = (values) => console.log(values);

  console.log(isConfirmationModalOpen);
  return (
    <>
      <TaskApplicationModal open={isConfirmationModalOpen} onClose={handleClose} handleSubmit={handleSubmit} />
      <ActionButton onClick={handleButtonClick}>
        <Claim />
        <span>{title}</span>
      </ActionButton>
    </>
  );
}
