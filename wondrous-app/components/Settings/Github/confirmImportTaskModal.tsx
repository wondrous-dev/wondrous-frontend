import { useMutation } from '@apollo/client';
import {
  StyledBody,
  StyledBox,
  StyledButtonsContainer,
  StyledCancelButton,
  StyledCloseButton,
  StyledDeleteLabel,
  StyledDeleteTaskButton,
  StyledDialog,
  StyledDivider,
  StyledHeader,
} from 'components/Common/DeleteEntityModal/styles';
import { DELETE_MILESTONE, DELETE_TASK } from 'graphql/mutations';
import CloseModalIcon from 'components/Icons/closeModal';
import { ArchivedIcon } from '../../Icons/statusIcons';

interface IImportTaskModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  onImport: () => void;
}

export function ImportTaskModal(props: IImportTaskModalProps) {
  const { open, onClose, onContinue, onImport } = props;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-task-modal"
      aria-describedby="modal-modal-description"
    >
      <StyledBox
        style={{
          width: 'fit-content',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <StyledCloseButton
          style={{
            marginLeft: '450px',
          }}
          onClick={onClose}
        >
          <CloseModalIcon />
        </StyledCloseButton>
        <StyledHeader>Do you want to import tasks from Github?</StyledHeader>
        <StyledBody>You cannot undo this action.</StyledBody>
        <StyledDivider />
        <StyledButtonsContainer>
          <StyledCancelButton
            style={{
              width: 'fit-content',
            }}
            onClick={onContinue}
          >
            Continue without importing
          </StyledCancelButton>
          <StyledDeleteTaskButton
            style={{
              textAlign: 'center',
            }}
            buttonInnerStyle={{
              justifyContent: 'center',
            }}
          >
            <StyledDeleteLabel
              style={{
                marginLeft: '0',
              }}
              onClick={onImport}
            >
              Import tasks
            </StyledDeleteLabel>
          </StyledDeleteTaskButton>
        </StyledButtonsContainer>
      </StyledBox>
    </StyledDialog>
  );
}
