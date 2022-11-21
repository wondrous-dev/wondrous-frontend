import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useMe } from 'components/Auth/withAuth';
import Link from 'next/link';
import { ActionButton } from 'components/Common/Task/styles';
import {
  GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD,
  GET_AUTO_CLAIMABLE_POD_ROLES,
  LIT_SIGNATURE_EXIST,
} from 'graphql/queries';
import { CLAIM_POD_ROLE, CREATE_LIT_SIGNATURE } from 'graphql/mutations/tokenGating';
import { LIT_PROTOCOL_MESSAGE } from 'utils/web3Constants';
import { StyledWarningMessage } from 'components/Common/ArchiveTaskModal/styles';
import RolePill from 'components/Common/RolePill';
import apollo from 'services/apollo';
import { useWonderWeb3 } from 'services/web3';
import NoRolesIcon from 'components/Icons/noRolesIcon';
import SuccessRoleModal from 'components/RoleModal/SuccessRoleModal';
import { IndividualRoleDisplay, RolePermissionDisplay } from 'components/RoleModal/RoleModalElement';
import { ErrorText } from 'components/Common';
import InfoIcon from 'components/Icons/infoIcon';
import Tooltip from 'components/Tooltip';
import palette from 'theme/palette';

import { NoUnderlineLink } from 'components/Common/Link/links';
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
  LitWarningMessage,
  ClaimRoleWarningWrapper,
} from './styles';

const PodCurrentRoleModal = (props) => {
  const { open, onClose, podId, linkedWallet, currentRoleName, setClaimedOrRequestedRole, setOpenJoinRequestModal } =
    props;

  const user = useMe();
  const wonderWeb3 = useWonderWeb3();
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notLinkedWalletError, setNotLinkedWalletError] = useState(null);
  const [litSignatureRequired, setLitSignatureRequired] = useState(false);

  const [getPodRoles, { data: podRolesData }] = useLazyQuery(GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD, {
    fetchPolicy: 'network-only',
  });
  const [getAutoClaimablePodRoles, { data: autoClaimableRolesData, loading: autoClaimLoading }] = useLazyQuery(
    GET_AUTO_CLAIMABLE_POD_ROLES,
    {
      fetchPolicy: 'network-only',
    }
  );
  const [litSignatureExist, { data: litSignatureExistData, loading: litSignatureLoading }] = useLazyQuery(
    LIT_SIGNATURE_EXIST,
    {
      fetchPolicy: 'network-only',
    }
  );
  useEffect(() => {
    if (linkedWallet && open) {
      litSignatureExist();
    }
  }, [linkedWallet, open, litSignatureExist]);

  const saveLitSignature = async () => {
    if (wonderWeb3.address?.toLowerCase() !== linkedWallet.toLowerCase()) {
      setNotLinkedWalletError(true);
      return;
    }
    if (!litSignatureExistData?.litSignatureExist?.exist) {
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
      } catch (e) {
        console.error(e);
      }
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

  const rolesWithTokenGate = rolesWithAccessCondition?.filter((role) => {
    if (!role.tokenGatingCondition) return false;
    if (role.tokenGatingCondition?.tokenAccessCondition) return true;
    return false;
  });
  const rolesWithDiscordAccess = rolesWithAccessCondition?.filter((role) => {
    if (role.discordRolesInfo?.length > 0) return true;
    return false;
  });

  useEffect(() => {
    if (!linkedWallet || !wonderWeb3?.address) return;
    if (wonderWeb3.address?.toLowerCase() !== linkedWallet.toLowerCase()) {
      setNotLinkedWalletError(null);
    }
    if (!rolesWithTokenGate || rolesWithTokenGate.length === 0) return;
    if (litSignatureLoading) return;
    if (!litSignatureExistData?.litSignatureExist?.exist) {
      setLitSignatureRequired(true);
    }
    if (litSignatureExistData?.litSignatureExist?.exist) {
      setLitSignatureRequired(false);
    }
  }, [wonderWeb3.address, linkedWallet, rolesWithTokenGate]);

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
        <RequestModalTitleBar>
          <RequestModalTitle>Explore Roles</RequestModalTitle>

          <RequestModalCloseIcon color={palette.white} onClick={handleClose} />
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
          {rolesWithAccessCondition?.length > 0 && (
            <RequestLightBoxContainer>
              <Tooltip title="you can still request roles that you lack requirements for" placement="top">
                <div style={{ display: 'flex' }}>
                  <RequestModalRolesSubtitle>Roles you can claim</RequestModalRolesSubtitle>
                  <InfoIcon style={{ marginLeft: 5 }} />
                </div>
              </Tooltip>

              {rolesWithDiscordAccess?.length !== 0 && !user?.userInfo?.discordUsername && (
                <ClaimRoleWarningWrapper>
                  <LitWarningMessage>To join via Discord, connect your discord to Wonder</LitWarningMessage>
                  <NoUnderlineLink href="/profile/settings">
                    <ActionButton style={{ marginLeft: 5 }}>Connect Discord</ActionButton>
                  </NoUnderlineLink>
                </ClaimRoleWarningWrapper>
              )}

              {rolesWithAccessCondition?.length !== 0 && notLinkedWalletError && (
                <ClaimRoleWarningWrapper>
                  <LitWarningMessage>
                    {`To join via token gated role, switch to linked wallet ${linkedWallet?.slice(0, 7)}...`}
                  </LitWarningMessage>
                </ClaimRoleWarningWrapper>
              )}

              {!notLinkedWalletError && litSignatureRequired && (
                <ClaimRoleWarningWrapper>
                  <LitWarningMessage>To join via token gated role, we need a signature from you</LitWarningMessage>
                  <ActionButton style={{ marginLeft: 5 }} onClick={saveLitSignature}>
                    Click here to sign
                  </ActionButton>
                </ClaimRoleWarningWrapper>
              )}
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
          )}
          {rolesWithoutAccessCondition?.length > 0 && (
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
          )}
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

export default PodCurrentRoleModal;
