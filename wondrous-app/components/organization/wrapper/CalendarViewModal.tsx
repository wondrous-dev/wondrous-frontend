import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { CHAR_LIMIT_PROFILE_BIO } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import CloseModalIcon from 'components/Icons/closeModal';
import { ArchivedIcon } from '../../Icons/statusIcons';
import {
  StyledArchivedLabel,
  StyledArchiveTaskButton,
  StyledBody,
  StyledBox,
  StyledButtonsContainer,
  StyledCancelButton,
  StyledCloseButton,
  StyledDialog,
  StyledDivider,
  StyledHeader,
  StyledWarningMessage,
} from '../../Common/ArchiveTaskModal/styles';
import { GeneralSettingsDAODescriptionInput } from '../../Settings/styles';
import { ErrorText } from 'components/Common';

export const CalendarViewModal = (props) => {
  const { open, onClose } = props;
  const board = useOrgBoard();
  const [requestMessage, setRequestMessage] = useState('');
  const [error, setError] = useState(null);
  return (
    <>
      <StyledDialog
        open={open}
        onClose={onClose}
        aria-labelledby="archive-task-modal"
        aria-describedby="modal-modal-description"
      >
        <StyledBox
          style={{
            width: 'auto',
            height: 'auto',
            padding: '20px',
          }}
        >
          <StyledCloseButton onClick={onClose}>
            <CloseModalIcon />
          </StyledCloseButton>
          <StyledHeader
            style={{
              marginLeft: 0,
            }}
          >
            Aug 18
          </StyledHeader>
          <StyledBody
            style={{
              marginLeft: 0,
            }}
          >
            <GeneralSettingsDAODescriptionInput
              multiline
              rows={3}
              value={requestMessage}
              placeholder="Send message to admin: Explain your skills, who you are, etc"
              onChange={(e) => {
                if (e.target.value?.length < CHAR_LIMIT_PROFILE_BIO) {
                  setRequestMessage(e.target.value);
                }
              }}
            />
            {error && <ErrorText>{error}</ErrorText>}
          </StyledBody>
          <StyledDivider
            style={{
              marginLeft: 0,
              width: 'auto',
            }}
          />
          <StyledButtonsContainer
            style={{
              marginRight: 0,
            }}
          >
            <StyledCancelButton onClick={onClose}>Cancel</StyledCancelButton>
            <StyledArchiveTaskButton>
              <ArchivedIcon />
            </StyledArchiveTaskButton>
          </StyledButtonsContainer>
        </StyledBox>
      </StyledDialog>
    </>
  );
};
