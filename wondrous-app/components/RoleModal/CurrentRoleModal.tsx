import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { PERMISSIONS } from 'utils/constants';
import { ActionButton } from 'components/Common/Task/styles';
import {
  GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD,
  GET_AUTO_CLAIMABLE_ORG_ROLES,
  GET_TOKEN_INFO,
  GET_NFT_INFO,
  LIT_SIGNATURE_EXIST,
} from 'graphql/queries';
import { CLAIM_ORG_ROLE, CREATE_LIT_SIGNATURE } from 'graphql/mutations/tokenGating';
import { LIT_PROTOCOL_MESSAGE } from 'utils/web3Constants';
import { useWonderWeb3 } from 'services/web3';
import { StyledWarningMessage } from 'components/Common/ArchiveTaskModal/styles';
import ChecklistRow from 'components/CheckList/ChecklistRow';
import RolePill from 'components/Common/RolePill';
import apollo from 'services/apollo';
import NoRolesIcon from 'components/Icons/noRolesIcon';
import { DiscordIcon } from 'components/Icons/discord';
import { Tooltip, CircularProgress } from '@mui/material';
import useGuildXyz from 'services/guildxyz';
import SuccessRoleModal from 'components/RoleModal/SuccessRoleModal';

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
  RequestModalRolesAbilityColumns,
  RequestModalRolesAbilityContainer,
  RequestModalRolesSubtitle,
  RequestModalTitle,
  RequestModalTitleBar,
  RequestModalTokenGatingLockBackground,
  RequestModalTokenGatingSubtitle,
} from './styles';

const AccessConditionDispaly = (props) => {
  const { role } = props;
  const tokenAccessCondition = role?.tokenGatingCondition?.tokenAccessCondition?.[0];
  const guildAccessCondition = role?.tokenGatingCondition?.guildAccessCondition;
  const { getGuildById } = useGuildXyz();
  const [guildRoleInfo, setGuildRoleInfo] = useState(null);
  const [tokenGatingInfo, setTokenGatingInfo] = useState(null);
  useEffect(() => {
    const fetchGuildRole = async () => {
      const guild = await getGuildById(guildAccessCondition?.guildId);
      const role = guild?.roles?.find((r) => r.id === Number(guildAccessCondition?.roleId));
      setGuildRoleInfo({ guild: guild.name, role: role?.name });
    };

    if (guildAccessCondition?.roleId) {
      fetchGuildRole();
    }
  }, [guildAccessCondition?.roleId]);

  useEffect(() => {
    const getTokenDisplayInfo = async () => {
      const { contractAddress } = tokenAccessCondition;
      switch (tokenAccessCondition.type) {
        case 'ERC20':
          apollo
            .query({
              query: GET_TOKEN_INFO,
              variables: {
                contractAddress,
                chain: tokenAccessCondition.chain,
              },
            })
            .then(({ data }) => {
              setTokenGatingInfo({
                chain: tokenAccessCondition.chain,
                image: data?.getTokenInfo.logoUrl,
                nameOrAddress: data?.getTokenInfo.name || tokenAccessCondition.contractAddress,
                minAmount: tokenAccessCondition.minValue,
              });
            });
          break;
        case 'ERC721':
          apollo
            .query({
              query: GET_NFT_INFO,
              variables: {
                contractAddress,
                chain: tokenAccessCondition.chain,
              },
            })
            .then(({ data }) => {
              setTokenGatingInfo({
                chain: tokenAccessCondition.chain,
                image: data?.getNFTInfo.logoUrl,
                nameOrAddress: data?.getNFTInfo.name || tokenAccessCondition.contractAddress,
                minAmount: tokenAccessCondition.minValue,
              });
            });
          break;
        default:
          break;
      }
    };

    if (tokenAccessCondition?.contractAddress) {
      getTokenDisplayInfo();
    }
  }, [tokenAccessCondition?.contractAddress]);

  return (
    <>
      {role?.discordRolesInfo?.length > 0 && (
        <RequestModalTokenGatingSubtitle>
          connected to: {role?.discordRolesInfo[0].name}
        </RequestModalTokenGatingSubtitle>
      )}
      {tokenGatingInfo && (
        <RequestModalTokenGatingSubtitle>connected to: {tokenGatingInfo.nameOrAddress}</RequestModalTokenGatingSubtitle>
      )}
      {guildRoleInfo && (
        <RequestModalTokenGatingSubtitle>connected to: {guildRoleInfo.role}</RequestModalTokenGatingSubtitle>
      )}
    </>
  );
};
export const RolePermissionDisplay = (props) => {
  const { role } = props;
  const roleCanDo = Object.keys(PERMISSIONS).filter((key) => role?.permissions?.includes(PERMISSIONS[key]));
  const roleCannotDo = Object.keys(PERMISSIONS).filter((key) => !role?.permissions?.includes(PERMISSIONS[key]));
  return (
    <RequestModalRolesAbilityContainer>
      <RequestModalRolesAbilityColumns>
        <RequestModalRolesSubtitle>This role can:</RequestModalRolesSubtitle>

        {roleCanDo?.includes(PERMISSIONS.FULL_ACCESS.toUpperCase())
          ? Object.keys(PERMISSIONS)?.map((permission) => (
              <ChecklistRow role={permission} key={permission} status="success" />
            ))
          : roleCanDo?.map((permission) => <ChecklistRow role={permission} key={permission} status="success" />)}
      </RequestModalRolesAbilityColumns>
      <RequestModalRolesAbilityColumns>
        <RequestModalRolesSubtitle>This role cannot:</RequestModalRolesSubtitle>
        {roleCannotDo.includes(PERMISSIONS.FULL_ACCESS.toUpperCase()) &&
          roleCannotDo?.map((permission) => <ChecklistRow role={permission} key={permission} status="fail" />)}
      </RequestModalRolesAbilityColumns>
    </RequestModalRolesAbilityContainer>
  );
};

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
    orgId,
    notLinkedWalletError,
    linkedWallet,
    currentRoleName,
    setClaimedOrRequestedRole,
    setOpenJoinRequestModal,
  } = props;
  const wonderWeb3 = useWonderWeb3();
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [getOrgRoles, { data: orgRolesData }] = useLazyQuery(GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD, {
    fetchPolicy: 'network-only',
  });
  const [getAutoClaimableOrgRoles, { data: autoClaimableRolesData, loading: autoClaimLoading }] = useLazyQuery(
    GET_AUTO_CLAIMABLE_ORG_ROLES,
    {
      fetchPolicy: 'network-only',
    }
  );

  const handleJoinOrgButtonClick = async () => {
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
      setOpenSuccessModal(true);
    } else {
      setOpenJoinRequestModal(true);
    }
    onClose();
    setSelectedRoleId(null);

    // try {
    //   await apollo.mutate({
    //     mutation: CLAIM_ORG_ROLE,
    //     variables: {
    //       orgRoleId: selectedRole?.id,
    //     },
    //     refetchQueries: ['getUserOrgRoles'],
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
