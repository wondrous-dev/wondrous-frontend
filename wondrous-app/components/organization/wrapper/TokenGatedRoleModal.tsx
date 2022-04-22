import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { CLOSE_TASK_PROPOSAL } from 'graphql/mutations';
import { GET_ORG_TASK_BOARD_TASKS, GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD } from 'graphql/queries';
import { removeProposalItem } from 'utils/board';
import { CHAR_LIMIT_PROFILE_BIO } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import CloseModalIcon from '../../Icons/closeModal';
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
} from '../../Common/ArchiveTaskModal/styles';
import { GeneralSettingsDAODescriptionInput } from '../../Settings/styles';
import TokenGatedRoleDisplay from './TokenGatedRoleDisplay';

export const TokenGatedRoleModal = (props) => {
  const { open, onClose, sendRequest, orgId, podId, setJoinRequestSent, tokenGatedRoles, setOpenJoinRequestModal } = props;
  const board = useOrgBoard();
  const [requestMessage, setRequestMessage] = useState('');
  if (!open) {
    return <></>
  }
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
            Token gated roles
          </StyledHeader>
          <StyledBody
            style={{
              marginLeft: 0,
            }}
          ></StyledBody>
          {tokenGatedRoles && tokenGatedRoles.map((role)=> <TokenGatedRoleDisplay key={role.id} role={role}/>)}
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
              <StyledArchivedLabel onClick={()=>setOpenJoinRequestModal(true)}>Request To Join</StyledArchivedLabel>
            </StyledArchiveTaskButton>
          </StyledButtonsContainer>
        </StyledBox>
      </StyledDialog>
    </>
  );
};
