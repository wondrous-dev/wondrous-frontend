import { useState, useContext } from 'react';
import { ActionButton } from 'components/Common/Task/styles';
import { Claim } from 'components/Icons/claimTask';
import { useMutation } from '@apollo/client';
import TaskApplicationModal from './TaskApplicationFormModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { CREATE_TASK_APPLICATION } from 'graphql/mutations';

interface Props {
  task: any;
  canApply: boolean;
  title?: string;
  setIsApplicationModalOpen?: (boolean) => void;
}

export default function TaskApplicationButton({ task, title = 'Apply', setIsApplicationModalOpen }: Props) {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);

  const handleClose = () => {
    setIsConfirmationModalOpen(false);
    setSnackbarAlertOpen(false);
    if (setIsApplicationModalOpen) setIsApplicationModalOpen(false);
  };

  const [createTaskApplication] = useMutation(CREATE_TASK_APPLICATION, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Application submitted successfully!');
      handleClose();
    },
    onError: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Something went wrong');
    },
    refetchQueries: ['getOrgTaskBoardTasks', 'getPodTaskBoardTasks'],
  });

  const handleButtonClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (setIsApplicationModalOpen) setIsApplicationModalOpen(true);
    setIsConfirmationModalOpen(true);
  };

  const handleSubmit = (values) => {
    createTaskApplication({
      variables: {
        input: {
          ...values,
          taskId: task?.id,
        },
      },
    });
  };

  const btnTitle = task?.hasUserApplied ? 'Applied' : title;

  return (
    <>
      {isConfirmationModalOpen && (
        <TaskApplicationModal open={isConfirmationModalOpen} onClose={handleClose} handleSubmit={handleSubmit} />
      )}
      <ActionButton onClick={handleButtonClick} disabled={task?.hasUserApplied}>
        <Claim />
        <span>{btnTitle}</span>
      </ActionButton>
    </>
  );
}
