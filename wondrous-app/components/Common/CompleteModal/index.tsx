import * as Constants from 'utils/constants';
import CloseModalIcon from 'components/Icons/closeModal';
import { Button as WonderButton } from 'components/Button';
import {
  StyledArchivedLabel,
  StyledBody,
  StyledBox,
  StyledButtonsContainer,
  StyledCancelButton,
  StyledCloseButton,
  StyledDialog,
  StyledDivider,
  StyledHeader,
} from 'components/Common/ArchiveTaskModal/styles';

interface ICompleteMilestoneModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (string) => void;
  taskType: string;
  taskId: string;
}

export function CompleteModal(props: ICompleteMilestoneModalProps) {
  const { open, onClose, onComplete, taskType, taskId = '' } = props;

  const handleComplete = () => {
    onComplete(Constants.TASK_STATUS_DONE);

    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="archive-task-modal"
      aria-describedby="modal-modal-description"
    >
      <StyledBox>
        <StyledCloseButton onClick={onClose}>
          <CloseModalIcon />
        </StyledCloseButton>
        <StyledHeader>Complete this {taskType}?</StyledHeader>
        <StyledBody>You cannot undo this action.</StyledBody>
        <StyledDivider />
        <StyledButtonsContainer>
          <StyledCancelButton onClick={onClose}>Cancel</StyledCancelButton>
          <WonderButton>
            <StyledArchivedLabel onClick={handleComplete}>Complete {taskType}</StyledArchivedLabel>
          </WonderButton>
        </StyledButtonsContainer>
      </StyledBox>
    </StyledDialog>
  );
}
