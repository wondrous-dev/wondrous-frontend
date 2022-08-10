import CloseModalIcon from 'components/Icons/closeModal';
import ClaimableDiscordRoleDisplay from 'components/organization/wrapper/ClaimableDiscordRoleDisplay';
import styled from 'styled-components';
import { Button } from '@mui/material';
import TokenGatedRoleDisplay from './TokenGatedRoleDisplay';
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

export function TokenGatedAndClaimableRoleModal(props) {
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
        />
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
  );
}
