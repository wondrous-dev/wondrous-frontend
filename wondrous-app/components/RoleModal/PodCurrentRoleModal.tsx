import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ActionButton } from 'components/Common/Task/styles';
import { GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD, GET_AUTO_CLAIMABLE_POD_ROLES } from 'graphql/queries';
import { CLAIM_POD_ROLE } from 'graphql/mutations/tokenGating';
import { StyledWarningMessage } from 'components/Common/ArchiveTaskModal/styles';
import RolePill from 'components/Common/RolePill';
import apollo from 'services/apollo';
import NoRolesIcon from 'components/Icons/noRolesIcon';
import SuccessRoleModal from 'components/RoleModal/SuccessRoleModal';
import { IndividualRoleDisplay, RolePermissionDisplay } from 'components/RoleModal/RoleModalElement';
import { ErrorText } from 'components/Common';

import {
  RequestLightBoxContainer,
  RequestMiddleContainer,
  RequestModalBox,
  RequestModalButtonsContainer,
  RequestModalCheckbox,
  RequestModalCheckPillCombo,
  RequestModalCloseIcon,
  RequestModalContainer,
  RequestModalHelperContainer,
  RequestModalHelperDiv,
  RequestModalNoRolesContainer,
  RequestModalNoRolesSubtitle,
  RequestModalRolesSubtitle,
  RequestModalTitle,
  RequestModalTitleBar,
} from './styles';

const CurrentRoleModal = (props) => {
  const {
    open,
    onClose,
    podId,
    notLinkedWalletError,
    linkedWallet,
    currentRoleName,
    setClaimedOrRequestedRole,
    setOpenJoinRequestModal,
  } = props;
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [getPodRoles, { data: podRolesData }] = useLazyQuery(GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD, {
    fetchPolicy: 'network-only',
  });
  const [getAutoClaimablePodRoles, { data: autoClaimableRolesData, loading: autoClaimLoading }] = useLazyQuery(
    GET_AUTO_CLAIMABLE_POD_ROLES,
    {
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (podId && open) {
      getPodRoles({
        variables: {
          podId,
        },
      });
      getAutoClaimablePodRoles({
        variables: {
          podId,
        },
      });
    }
  }, [getPodRoles, podId, open]);

  const podRoles = podRolesData?.getPodRoles; // all roles for pod
  const noneCurrentRoles = podRoles?.filter((role) => role.name !== currentRoleName);
  const rolesWithAccessCondition = noneCurrentRoles?.filter((role) => {
    if (role.discordRolesInfo?.length > 0) return true;
    if (role.tokenGatingCondition) return true;
    return false;
  });
  const rolesWithoutAccessCondition = noneCurrentRoles?.filter((role) => {
    if (role.discordRolesInfo?.length > 0) return false;
    if (role.tokenGatingCondition) return false;
    return true;
  });
  const currentRole = currentRoleName && podRoles?.find((r) => r.name === currentRoleName);
  const claimableRoles = autoClaimableRolesData?.getAutoClaimablePodRoles;
  const selectedRole = selectedRoleId && noneCurrentRoles?.find((r) => r.id === selectedRoleId);
  const selectedRoleHasAccessCondition =
    selectedRole?.discordRolesInfo?.length > 0 || selectedRole?.tokenGatingCondition;
  const selectedRoleIsClaimable =
    selectedRoleId && selectedRoleHasAccessCondition && claimableRoles?.some((r) => r.id === selectedRoleId);

  const handleClose = () => {
    onClose();
    setSelectedRoleId(null);
    setOpenSuccessModal(false);
  };

  const handleClaimClick = async () => {
    setClaimedOrRequestedRole(selectedRole);
    if (selectedRoleIsClaimable) {
      try {
        await apollo.mutate({
          mutation: CLAIM_POD_ROLE,
          variables: {
            podRoleId: selectedRole?.id,
          },
          refetchQueries: ['getUserPodRoles'],
        });
      } catch (e) {
        console.error(e);
        setErrorMessage('Failed to claim role, please try again');
        return;
      }
      setOpenSuccessModal(true);
    } else {
      setOpenJoinRequestModal(true);
    }
    onClose();
    setSelectedRoleId(null);
  };
  if (openSuccessModal) {
    return <SuccessRoleModal open={openSuccessModal} role={selectedRole} onClose={handleClose} />;
  }

  return (
    <RequestModalContainer
      open={open}
      onClose={handleClose}
      aria-labelledby="archive-task-modal"
      aria-describedby="modal-modal-description"
    >
      <RequestModalBox
        style={{
          width: '600px',
          height: 'auto',
        }}
      >
        {notLinkedWalletError && (
          <StyledWarningMessage
            style={{
              marginLeft: 0,
            }}
          >
            {`To join via token gated role, switch to linked wallet ${linkedWallet?.slice(0, 7)}...`}
          </StyledWarningMessage>
        )}

        <RequestModalTitleBar>
          <RequestModalTitle>Explore Roles</RequestModalTitle>

          <RequestModalCloseIcon color="#FFFFFF" onClick={handleClose} />
        </RequestModalTitleBar>
        <RequestMiddleContainer>
          {currentRoleName && (
            <RequestLightBoxContainer>
              <RequestModalRolesSubtitle>Current role</RequestModalRolesSubtitle>
              <RequestModalCheckPillCombo>
                <RequestModalCheckbox disabled checked />
                <RequestModalHelperContainer>
                  <RolePill roleName={currentRoleName} />
                  <RequestModalHelperDiv />
                </RequestModalHelperContainer>
              </RequestModalCheckPillCombo>
              <RolePermissionDisplay role={currentRole} />
            </RequestLightBoxContainer>
          )}
          <RequestLightBoxContainer>
            <RequestModalRolesSubtitle>Roles you can claim</RequestModalRolesSubtitle>
            {rolesWithAccessCondition?.length === 0 && (
              <RequestModalNoRolesContainer>
                <NoRolesIcon />
                <RequestModalNoRolesSubtitle style={{ marginTop: '8px' }}>
                  No claimable roles yet
                </RequestModalNoRolesSubtitle>
              </RequestModalNoRolesContainer>
            )}
            {rolesWithAccessCondition?.map((role, index) => (
              <IndividualRoleDisplay
                key={role.id}
                role={role}
                selectedRoleId={selectedRoleId}
                setSelectedRoleId={setSelectedRoleId}
                hasAccessCondition
                autoClaimLoading={autoClaimLoading}
                claimabeRoles={claimableRoles}
              />
            ))}
          </RequestLightBoxContainer>
          <RequestLightBoxContainer>
            <RequestModalRolesSubtitle>Roles you can request</RequestModalRolesSubtitle>
            {rolesWithoutAccessCondition?.map((role, index) => (
              <IndividualRoleDisplay
                key={role.id}
                role={role}
                selectedRoleId={selectedRoleId}
                setSelectedRoleId={setSelectedRoleId}
              />
            ))}
          </RequestLightBoxContainer>
        </RequestMiddleContainer>
      </RequestModalBox>

      {selectedRoleId && (
        <RequestModalButtonsContainer
          style={{
            marginRight: 0,
          }}
        >
          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

          <ActionButton
            style={{ padding: '8px 30px 8px 30px', marginLeft: '8px' }}
            disabled={selectedRoleHasAccessCondition && autoClaimLoading}
            onClick={handleClaimClick}
          >
            {!selectedRoleHasAccessCondition && 'Request Role'}
            {selectedRoleHasAccessCondition && selectedRoleIsClaimable && 'Claim role'}
            {selectedRoleHasAccessCondition && !selectedRoleIsClaimable && 'Request Role'}
          </ActionButton>
        </RequestModalButtonsContainer>
      )}
    </RequestModalContainer>
  );
};

export default CurrentRoleModal;
