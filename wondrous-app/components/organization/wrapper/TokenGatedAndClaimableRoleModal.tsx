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
  StyledDialog,
  StyledDivider,
  StyledHeader,
} from '../../Common/ArchiveTaskModal/styles';
import { TokenGatedRoleDescription } from './styles';
import { GeneralSettingsDAODescriptionInput } from '../../Settings/styles';
import TokenGatedRoleDisplay from './TokenGatedRoleDisplay';
import ClaimableDiscordRoleDisplay from 'components/organization/wrapper/ClaimableDiscordRoleDisplay';
import styled from 'styled-components';
import { Button } from '@mui/material';

export const StyledCloseButton = styled(Button)`
  && {
    min-width: 0px;
    width: 34.9px;
    height: 34.9px;
    background: rgba(0, 0, 0, 1);
    position: absolute;
    right: 10px;
    top: 10px;

    :hover {
      background: rgba(0, 0, 0, 0.5);
    }
  }
`;

export const TokenGatedAndClaimableRoleModal = (props) => {
  const {
    open,
    onClose,
    sendRequest,
    orgId,
    podId,
    setJoinRequestSent,
    tokenGatedRoles,
    setOpenJoinRequestModal,
    claimableDiscordRole,
    orgRoleName,
  } = props;

  if (!open) {
    return <></>;
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
            width: '500px',
            height: 'auto',
            padding: '20px',
          }}
        >
          <StyledCloseButton onClick={onClose}>
            <CloseModalIcon onClick={onClose} />
          </StyledCloseButton>

          {orgRoleName && (
            <StyledHeader
              style={{
                marginLeft: 0,
                marginBottom: 20,
              }}
            >
              Your current role: <span style={{ color: '#ccbbff' }}>{orgRoleName}</span>
            </StyledHeader>
          )}
          {claimableDiscordRole && claimableDiscordRole.length > 0 && (
            <div
              style={{
                marginBottom: 20,
              }}
            >
              <StyledHeader
                style={{
                  marginLeft: 0,
                }}
              >
                Claimable Discord Roles
              </StyledHeader>
              {claimableDiscordRole.map((role) => (
                <ClaimableDiscordRoleDisplay key={role.id} role={role} />
              ))}
            </div>
          )}

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
          {tokenGatedRoles && tokenGatedRoles.map((role) => <TokenGatedRoleDisplay key={role.id} role={role} />)}
          <StyledDivider
            style={{
              marginLeft: 0,
              width: 'auto',
            }}
          />
          <StyledButtonsContainer
            style={{
              marginRight: 0,
              marginTop: 10,
            }}
          >
            <StyledCancelButton onClick={onClose}>Cancel</StyledCancelButton>
            <StyledArchiveTaskButton>
              <StyledArchivedLabel onClick={() => setOpenJoinRequestModal(true)}>Request To Join</StyledArchivedLabel>
            </StyledArchiveTaskButton>
          </StyledButtonsContainer>
        </StyledBox>
      </StyledDialog>
    </>
  );
};
