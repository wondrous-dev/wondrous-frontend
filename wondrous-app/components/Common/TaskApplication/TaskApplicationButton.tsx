import { useState, useContext } from 'react';
import { Claim } from 'components/Icons/claimTask';
import { useMutation } from '@apollo/client';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { CREATE_TASK_APPLICATION } from 'graphql/mutations';
import { white } from 'theme/colors';
import TaskApplicationModal from './TaskApplicationFormModal';
import { ButtonPrimary } from '../button';

interface Props {
  task: any;
  canApply: boolean;
  title?: string;
  setIsApplicationModalOpen?: (boolean) => void;
  Icon?: React.ElementType;
  style?: object;
}

export default function TaskApplicationButton({
  task,
  title = 'Apply',
  setIsApplicationModalOpen,
  Icon = () => <Claim />,
  style,
}: Props) {
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
    refetchQueries: [
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getTaskApplications',
      'getTaskApplicationsCount',
      'getTaskById',
    ],
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

  const btnTitle = task?.taskApplicationPermissions?.hasUserApplied ? 'Applied' : title;

  return (
    <>
      {isConfirmationModalOpen && (
        <TaskApplicationModal open={isConfirmationModalOpen} onClose={handleClose} handleSubmit={handleSubmit} />
      )}
      <ButtonPrimary
        startIcon={<Icon />}
        onClick={handleButtonClick}
        disabled={task?.taskApplicationPermissions?.hasUserApplied}
        style={{
          ...style,
        }}
      >
        <span
          style={{
            color: white,
            width: '100%',
          }}
        >
          {btnTitle}
        </span>
      </ButtonPrimary>
    </>
  );
}
