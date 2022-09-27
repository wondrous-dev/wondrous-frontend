import { useEffect, useState } from 'react';
import { PERMISSIONS } from 'utils/constants';
import { ActionButton } from 'components/Common/Task/styles';
import { GET_TOKEN_INFO, GET_NFT_INFO } from 'graphql/queries';
import ChecklistRow from 'components/CheckList/ChecklistRow';
import RolePill from 'components/Common/RolePill';
import apollo from 'services/apollo';
import NoRolesIcon from 'components/Icons/noRolesIcon';
import { DiscordIcon } from 'components/Icons/discord';
import { Tooltip, CircularProgress } from '@mui/material';
import useGuildXyz from 'services/guildxyz';
import SuccessRoleModal from 'components/RoleModal/SuccessRoleModal';

import {
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

export const IndividualRoleDisplay = (props) => {
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
