import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ActionButton } from 'components/Common/Task/styles';
import {
  GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD,
  GET_AUTO_CLAIMABLE_ORG_ROLES,
  LIT_SIGNATURE_EXIST,
  GET_USER_PERMISSION_CONTEXT,
} from 'graphql/queries';
import { CLAIM_ORG_ROLE, CREATE_LIT_SIGNATURE } from 'graphql/mutations/tokenGating';
import { LIT_PROTOCOL_MESSAGE } from 'utils/web3Constants';
import { useWonderWeb3 } from 'services/web3';
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

const useObtainLitSignature = (activeEthAddress) => {
  const wonderWeb3 = useWonderWeb3();

  const checkAndObtainLitSignature = async () => {
    let litSignatureExistResult;
    try {
      litSignatureExistResult = await apollo.query({
        query: LIT_SIGNATURE_EXIST,
      });
    } catch (e) {
      console.error(e);
      return false;
    }
    const litSignatureExist = litSignatureExistResult?.data?.litSignatureExist;
    if (litSignatureExist?.exist) return true;
    if (!litSignatureExist?.exist) {
      try {
        const signedMessage = await wonderWeb3.signMessage(LIT_PROTOCOL_MESSAGE);
        await apollo.mutate({
          mutation: CREATE_LIT_SIGNATURE,
          variables: {
            input: {
              signature: signedMessage,
              signingAddress: wonderWeb3.address, // todo check if the address mathces the current connected address
            },
          },
        });
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  };
};
const CurrentRoleModal = (props) => {
  const {
    open,
    onClose,
    orgId,
    notLinkedWalletError,
    linkedWallet,
    currentRoleName,
    setClaimedOrRequestedRole,
    setOpenJoinRequestModal,
  } = props;
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [getOrgRoles, { data: orgRolesData }] = useLazyQuery(GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD, {
    fetchPolicy: 'network-only',
  });
  const [getAutoClaimableOrgRoles, { data: autoClaimableRolesData, loading: autoClaimLoading }] = useLazyQuery(
    GET_AUTO_CLAIMABLE_ORG_ROLES,
    {
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (orgId && open) {
      getOrgRoles({
        variables: {
          orgId,
        },
      });
      getAutoClaimableOrgRoles({
        variables: {
          orgId,
        },
      });
    }
  }, [getOrgRoles, orgId, open]);

  const orgRoles = orgRolesData?.getOrgRoles; // all roles for org
  const noneCurrentRoles = orgRoles?.filter((role) => role.name !== currentRoleName);
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
  const currentRole = currentRoleName && orgRoles?.find((r) => r.name === currentRoleName);
  const claimableRoles = autoClaimableRolesData?.getAutoClaimableOrgRoles;
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
          mutation: CLAIM_ORG_ROLE,
          variables: {
            orgRoleId: selectedRole?.id,
          },
          refetchQueries: ['getUserOrgRoles', GET_USER_PERMISSION_CONTEXT],
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
