import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ActionButton } from 'components/Common/Task/styles';
import {
  GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD,
  GET_AUTO_CLAIMABLE_POD_ROLES,
  LIT_SIGNATURE_EXIST,
} from 'graphql/queries';
import { CLAIM_POD_ROLE, CREATE_LIT_SIGNATURE } from 'graphql/mutations/tokenGating';
import { LIT_PROTOCOL_MESSAGE } from 'utils/web3Constants';
import { useWonderWeb3 } from 'services/web3';
import { StyledWarningMessage } from 'components/Common/ArchiveTaskModal/styles';
import RolePill from 'components/Common/RolePill';
import apollo from 'services/apollo';
import NoRolesIcon from 'components/Icons/noRolesIcon';
import { Tooltip, CircularProgress } from '@mui/material';
import SuccessRoleModal from 'components/RoleModal/SuccessRoleModal';
import { RolePermissionDisplay } from 'components/RoleModal/CurrentRoleModal';

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
  RequestModalHorizontalAlign,
  RequestModalLockedIconOutline,
  SuccessLockedIconOutline,
  RequestModalNoRolesContainer,
  RequestModalNoRolesSubtitle,
  RequestModalRolesSubtitle,
  RequestModalTitle,
  RequestModalTitleBar,
  RequestModalTokenGatingLockBackground,
  RequestModalTokenGatingSubtitle,
} from './styles';

const IndividualRoleDisplay = (props) => {
  const {
    role,
    setSelectedRoleId,
    selectedRoleId,
    hasAccessCondition = false,
    autoClaimLoading,
    claimabeRoles,
  } = props;
  const selected = selectedRoleId === role?.id;
  const handleSelect = () => {
    if (selected) {
      setSelectedRoleId(null);
      return;
    }
    setSelectedRoleId(role?.id);
  };
  const claimable = claimabeRoles?.find((claimableRole) => claimableRole?.id === role?.id);
  return (
    <div>
      <RequestModalCheckPillCombo>
        <div onClick={handleSelect}>
          <RequestModalCheckbox checked={selected} />
        </div>
        <RequestModalHelperContainer>
          <RolePill roleName={role.name} />
          {hasAccessCondition && autoClaimLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', marginLeft: 5 }}>
              <CircularProgress size={20} />
            </div>
          )}
          {hasAccessCondition && !autoClaimLoading && claimable && (
            <div style={{ display: 'flex', justifyContent: 'center', marginLeft: 5 }}>
              <RequestModalHorizontalAlign>
                <RequestModalTokenGatingLockBackground>
                  <SuccessLockedIconOutline />
                </RequestModalTokenGatingLockBackground>
                <RequestModalTokenGatingSubtitle color="white" style={{ paddingLeft: '8px' }}>
                  Can Claim
                </RequestModalTokenGatingSubtitle>
              </RequestModalHorizontalAlign>
            </div>
          )}
          {hasAccessCondition && !autoClaimLoading && !claimable && (
            <div style={{ display: 'flex', justifyContent: 'center', marginLeft: 5 }}>
              <RequestModalHorizontalAlign>
                <RequestModalTokenGatingLockBackground>
                  <RequestModalLockedIconOutline />
                </RequestModalTokenGatingLockBackground>
                <RequestModalTokenGatingSubtitle color="white" style={{ paddingLeft: '8px' }}>
                  Requirement Missing
                </RequestModalTokenGatingSubtitle>
                {/* <RequestModalTokenGatingSubtitle color={redColors.red300} style={{ paddingLeft: '8px' }}>
                Requirement Missing
                </RequestModalTokenGatingSubtitle> */}
              </RequestModalHorizontalAlign>
            </div>
          )}
          {/* <RequestModalHelperDiv /> */}
        </RequestModalHelperContainer>
      </RequestModalCheckPillCombo>
      {selected && (
        <>
          {/* {hasAccessCondition && <AccessConditionDispaly role={role} />} */}
          <RolePermissionDisplay role={role} />
        </>
      )}
    </div>
  );
};

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
  const wonderWeb3 = useWonderWeb3();
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [getPodRoles, { data: podRolesData }] = useLazyQuery(GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD, {
    fetchPolicy: 'network-only',
  });
  const [getAutoClaimablePodRoles, { data: autoClaimableRolesData, loading: autoClaimLoading }] = useLazyQuery(
    GET_AUTO_CLAIMABLE_POD_ROLES,
    {
      fetchPolicy: 'network-only',
    }
  );

  const handleJoinPodButtonClick = async () => {
    const foo = linkedWallet;
    let litSignatureExistResult;
    try {
      litSignatureExistResult = await apollo.query({
        query: LIT_SIGNATURE_EXIST,
      });
    } catch (e) {
      console.error(e);
    }
    const litSignatureExist = litSignatureExistResult?.data?.litSignatureExist;
    if (!litSignatureExist?.exist) {
      try {
        const signedMessage = await wonderWeb3.signMessage(LIT_PROTOCOL_MESSAGE);
        await apollo.mutate({
          mutation: CREATE_LIT_SIGNATURE,
          variables: {
            input: {
              signature: signedMessage,
              signingAddress: wonderWeb3.address,
            },
          },
        });
      } catch (e) {}
    }
  };

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
      setOpenSuccessModal(true);
    } else {
      setOpenJoinRequestModal(true);
    }
    onClose();
    setSelectedRoleId(null);

    // try {
    //   await apollo.mutate({
    //     mutation: CLAIM_POD_ROLE,
    //     variables: {
    //       podRoleId: selectedRole?.id,
    //     },
    //     refetchQueries: ['getUserPodRoles'],
    //   });
    // } catch (e) {
    //   console.error(e);
    // }
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
