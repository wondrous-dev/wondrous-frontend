import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import apollo from 'services/apollo';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import UserCheckIcon from '../../Icons/userCheckIcon';
import Accordion from '../../Common/Accordion';
import Switch from '../../Common/Switch';

import {
  Box,
  CreateRole,
  CreateRoleButton,
  DeleteButton,
  LabelBlock,
  Permission,
  PermissionFooter,
  Permissions,
  PermissionSubtitle,
  PermissionTitle,
  RoleNameBlock,
  RoleNameInput,
  RolesContainer,
  RolesInputsBlock,
  Snackbar,
  TokenGatingButton,
  TitleLockIconWrapper,
  RoleTokenGatingWrapper,
  TokenGatedRoleModal,
  TokenGatedRoleModalTitle,
  TokenGatingButtonText,
} from './styles';
import {
  TokenGatingNameHeader,
  TokenGatingElementWrapper,
  TokenGateActionMenu,
  TokenGateListDiv,
  TokenGateListItemDiv,
  TokenGatingHeaderLabel,
  TokenLogoDisplay,
} from 'components/Settings/TokenGating/styles';
import { TaskMenuIcon } from '../../Icons/taskMenu';
import { DropDown, DropDownItem } from '../../Common/dropdown';
import { White } from 'theme/colors';

import { Role } from 'types/common';
import RoleLockIcon from '../../Icons/rolesLock.svg';
import { GET_TOKEN_INFO, GET_NFT_INFO, GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries/tokenGating';
import { GET_ORG_ROLES_WITH_TOKEN_GATE } from 'graphql/queries/org';
import { GET_POD_ROLES_WITH_TOKEN_GATE } from 'graphql/queries/pod';
import {
  APPLY_TOKEN_GATING_TO_ORG_ROLE,
  APPLY_TOKEN_GATING_TO_POD_ROLE,
  REMOVE_TOKEN_GATING_FROM_ORG_ROLE,
  REMOVE_TOKEN_GATING_FROM_POD_ROLE,
} from 'graphql/mutations/tokenGating';
import { delQuery } from 'utils';

type Props = {
  orgId: any;
  podId?: String;
  roles: Role[];
  permissons: Array<{
    title: string;
    subTitle: string;
    permission: string;
  }>;
  toast: { show: boolean; message: string };
  onCreateNewRole: (name: string, permissions: string[]) => any;
  onDeleteRole: (role: Role) => any;
  onPermissionsChange: (role: Role, permissions: string[]) => any;
  onToastClose: () => any;
  getOrgRolesWithTokenGate?: () => any;
  getPodRolesWithTokenGate?: () => any;
};

const Roles = ({
  orgId,
  podId,
  roles,
  onCreateNewRole,
  onDeleteRole,
  onPermissionsChange,
  toast,
  onToastClose,
  permissons,
  getOrgRolesWithTokenGate,
  getPodRolesWithTokenGate,
}: Props) => {
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissionsExpanded, setNewRolePermissionsExpanded] = useState(false);
  const [newRolePermissions, setNewRolePermissions] = useState([]);
  const [tokenGatedRoleModalOpen, setTokenGatedRoleModalOpen] = useState(false);
  const [selectedRoleForTokenGate, setSelectedRoleForTokenGate] = useState(null);

  // Creates new role
  function handleCreateNewRoleClick() {
    onCreateNewRole(newRoleName, newRolePermissions);
    setNewRolePermissions([]);
    setNewRoleName('');
    setNewRolePermissionsExpanded(false);
  }

  function handleRolePermissionChange(role: Role, permission: string, checked: boolean) {
    const permissions = [...role.permissions];

    if (checked) {
      permissions.push(permission);
    } else {
      permissions.splice(permissions.indexOf(permission), 1);
    }

    onPermissionsChange(role, permissions);
  }

  function handleNewRolePermissionChange(permission: string, checked: boolean) {
    const permissions = [...newRolePermissions];

    if (checked) {
      permissions.push(permission);
    } else {
      permissions.splice(newRolePermissions.indexOf(permission), 1);
    }

    setNewRolePermissions(permissions);
  }

  const handleRoleNameChange = (e) => {
    const roleName = e.target.value;
    setNewRoleName(roleName);
    if (!roleName) {
      setNewRolePermissionsExpanded(false);
    }
  };
  const handleCloseModal = () => {
    setTokenGatedRoleModalOpen(false);
  };

  return (
    <SettingsWrapper>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={toast.show}
        onClose={onToastClose}
        message={toast.message}
      />
      <TokenGateRoleConfigModal
        open={tokenGatedRoleModalOpen}
        handleClose={handleCloseModal}
        orgId={orgId}
        podId={podId}
        selectedRoleForTokenGate={selectedRoleForTokenGate}
        getOrgRolesWithTokenGate={getOrgRolesWithTokenGate}
        getPodRolesWithTokenGate={getPodRolesWithTokenGate}
      />

      <RolesContainer>
        <HeaderBlock
          icon={<UserCheckIcon circle />}
          title="Roles"
          description="Use roles to organize contributors and admins"
        />
        <RolesInputsBlock>
          <RoleNameBlock>
            <LabelBlock>Create a new role</LabelBlock>

            <CreateRole>
              <RoleNameInput value={newRoleName} onChange={handleRoleNameChange} />
              <CreateRoleButton onClick={handleCreateNewRoleClick} disabled={!newRoleName} highlighted={!!newRoleName}>
                Create role
              </CreateRoleButton>
            </CreateRole>
          </RoleNameBlock>
        </RolesInputsBlock>
        <Accordion
          title="Select permissions"
          disabled={!newRoleName}
          expanded={newRolePermissionsExpanded}
          onChange={(e, expanded) => setNewRolePermissionsExpanded(expanded)}
        >
          <Permissions>
            {permissons.map((item) => (
              <Permission key={item.permission}>
                <div>
                  <PermissionTitle>{item.title}</PermissionTitle>
                  <PermissionSubtitle>{item.subTitle}</PermissionSubtitle>
                </div>
                <Switch
                  size="medium"
                  checked={newRolePermissions.includes(item.permission)}
                  onChange={(e) => handleNewRolePermissionChange(item.permission, e.currentTarget.checked)}
                />
              </Permission>
            ))}
          </Permissions>
        </Accordion>

        {roles.length ? <LabelBlock mt={120}>{roles.length} Existing roles</LabelBlock> : null}

        {roles.map(
          (
            orgRole // this isn't org role, i think it's both
          ) => (
            <Box key={orgRole.id} mt={22}>
              <Accordion
                title={
                  <TitleLockIconWrapper>
                    <p>{orgRole.name}</p>
                    {orgRole.tokenGatingCondition ? <RoleLockIcon /> : null}
                  </TitleLockIconWrapper>
                }
              >
                <Permissions>
                  <TokenGatingOnRoleDisplay
                    tokenGatingCondition={orgRole.tokenGatingCondition}
                    setTokenGatedRoleModalOpen={setTokenGatedRoleModalOpen}
                    role={orgRole}
                    setSelectedRoleForTokenGate={setSelectedRoleForTokenGate}
                  />
                  {permissons.map((item) => (
                    <Permission key={item.permission}>
                      <div>
                        <PermissionTitle>{item.title}</PermissionTitle>
                        <PermissionSubtitle>{item.subTitle}</PermissionSubtitle>
                      </div>
                      <Switch
                        size="medium"
                        checked={orgRole.permissions.includes(item.permission)}
                        onChange={(e) => handleRolePermissionChange(orgRole, item.permission, e.currentTarget.checked)}
                      />
                    </Permission>
                  ))}
                  <PermissionFooter>
                    <DeleteButton onClick={() => onDeleteRole(orgRole)}>Delete role</DeleteButton>
                  </PermissionFooter>
                </Permissions>
              </Accordion>
            </Box>
          )
        )}
      </RolesContainer>
    </SettingsWrapper>
  );
};

const TokenGatingOnRoleDisplay = (props) => {
  const { tokenGatingCondition, setTokenGatedRoleModalOpen, role, setSelectedRoleForTokenGate } = props;
  const handleEditClick = () => {
    setSelectedRoleForTokenGate(role);
    setTokenGatedRoleModalOpen(true);
  };
  return (
    <RoleTokenGatingWrapper>
      <TitleLockIconWrapper>
        {tokenGatingCondition ? (
          <>
            <PermissionTitle>Active Token Gate: {tokenGatingCondition?.name}</PermissionTitle>
            <RoleLockIcon />
          </>
        ) : (
          <PermissionTitle>Token Gating: Inactive</PermissionTitle>
        )}
      </TitleLockIconWrapper>
      <TokenGatingButton onClick={handleEditClick} highlighted={true}>
        {tokenGatingCondition ? 'Edit' : 'Add token gate'}
      </TokenGatingButton>
    </RoleTokenGatingWrapper>
  );
};

const TokenGateRoleConfigModal = (props) => {
  const router = useRouter();
  const {
    open,
    handleClose,
    orgId,
    podId,
    selectedRoleForTokenGate,
    getOrgRolesWithTokenGate,
    getPodRolesWithTokenGate,
  } = props;
  const [tokenGatingConditions, setTokenGatingConditions] = useState([]);
  const [getTokenGatingConditionsForOrg, { data, loading, fetchMore }] = useLazyQuery(
    GET_TOKEN_GATING_CONDITIONS_FOR_ORG,
    {
      onCompleted: (data) => {
        setTokenGatingConditions(data?.getTokenGatingConditionsForOrg);
      },
      fetchPolicy: 'network-only',
    }
  );
  useEffect(() => {
    if (orgId && open) {
      getTokenGatingConditionsForOrg({
        variables: {
          orgId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, open]);

  const handleRemoveTokenGateFromRole = async () => {
    try {
      if (selectedRoleForTokenGate?.__typename === 'OrgRole') {
        const orgRoles = await apollo.mutate({
          mutation: REMOVE_TOKEN_GATING_FROM_ORG_ROLE,
          variables: {
            orgRoleId: selectedRoleForTokenGate?.id,
          },
        });
        getOrgRolesWithTokenGate();
      }

      if (selectedRoleForTokenGate?.__typename === 'PodRole') {
        await apollo.mutate({
          mutation: REMOVE_TOKEN_GATING_FROM_POD_ROLE,
          variables: {
            orgRoleId: selectedRoleForTokenGate?.id,
          },
        });
        getPodRolesWithTokenGate();
      }
    } catch (e) {
      console.error(e);
      return;
    }
    handleClose();
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <TokenGatedRoleModal>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TokenGatedRoleModalTitle>Token gating for {selectedRoleForTokenGate?.name} role</TokenGatedRoleModalTitle>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <TokenGatingButton onClick={handleRemoveTokenGateFromRole} highlighted={false}>
                remove
              </TokenGatingButton>
              <TokenGatingButton
                onClick={() => {
                  router.push(`/organization/settings/${orgId}/token-gating`, undefined, {
                    shallow: true,
                  });
                }}
                highlighted={true}
              >
                create new
              </TokenGatingButton>
            </div>
          </div>
          {tokenGatingConditions.map((tokenGatingCondition) => {
            return (
              <TokenGatingModalElement
                key={tokenGatingCondition.id}
                tokenGatingCondition={tokenGatingCondition}
                selectedRoleForTokenGate={selectedRoleForTokenGate}
                handleClose={handleClose}
                orgId={orgId}
                getOrgRolesWithTokenGate={getOrgRolesWithTokenGate}
                getPodRolesWithTokenGate={getPodRolesWithTokenGate}
              />
            );
          })}
        </TokenGatedRoleModal>
      </Modal>
    </>
  );
};

const TokenGatingModalElement = (props) => {
  const [tokenName, setTokenName] = useState(null);
  const [tokenLogo, setTokenLogo] = useState(null);
  const { tokenGatingCondition, selectedRoleForTokenGate, handleClose, orgId, getOrgRolesWithTokenGate, getPodRolesWithTokenGate } = props;
  const router = useRouter();
  const [getTokenInfo, { loading: getTokenInfoLoading }] = useLazyQuery(GET_TOKEN_INFO, {
    onCompleted: (data) => {
      if (data?.getTokenInfo) {
        setTokenName(data?.getTokenInfo.name);
        setTokenLogo(data?.getTokenInfo.logoUrl);
      }
    },
    fetchPolicy: 'network-only',
  });

  const [getNFTInfo, { loading: getNFTInfoLoading }] = useLazyQuery(GET_NFT_INFO, {
    onCompleted: (data) => {
      if (data?.getNFTInfo) {
        setTokenName(data?.getNFTInfo.name);
        setTokenLogo(data?.getNFTInfo.logoUrl);
      }
    },
    fetchPolicy: 'network-only',
  });
  const contractAddress = tokenGatingCondition?.accessCondition[0].contractAddress;
  const dropdownItemStyle = {
    marginRight: '12px',
    color: White,
  };

  useEffect(() => {
    const getTokenDisplayInfo = async () => {
      const type = tokenGatingCondition?.accessCondition[0].type;
      if (type === 'ERC20') {
        getTokenInfo({
          variables: {
            contractAddress,
            chain: tokenGatingCondition?.accessCondition[0].chain,
          },
        });
      }
      if (type === 'ERC721') {
        getNFTInfo({
          variables: {
            contractAddress,
          },
        });
      }
    };

    getTokenDisplayInfo();
  }, [tokenGatingCondition?.accessCondition[0].contractAddress]);
  const handleWrapperElementClick = async () => {
    const confirmed = confirm(`Apply ${tokenGatingCondition?.name} to role?`);
    if (!confirmed) {
      return;
    }
    try {
      if (selectedRoleForTokenGate?.__typename === 'OrgRole') {
        await apollo.mutate({
          mutation: APPLY_TOKEN_GATING_TO_ORG_ROLE,
          variables: {
            tokenGatingConditionId: tokenGatingCondition?.id,
            orgRoleId: selectedRoleForTokenGate?.id,
          },
        });
        getOrgRolesWithTokenGate();
      }

      if (selectedRoleForTokenGate?.__typename === 'PodRole') {
        await apollo.mutate({
          mutation: APPLY_TOKEN_GATING_TO_POD_ROLE,
          variables: {
            tokenGatingConditionId: tokenGatingCondition?.id,
            orgRoleId: selectedRoleForTokenGate?.id,
          },
        });
        getPodRolesWithTokenGate();
      }
    } catch (e) {
      console.error(e);
      return;
    }
    handleClose();
  };
  return (
    <TokenGatingElementWrapper onClick={handleWrapperElementClick}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TokenGatingNameHeader>{tokenGatingCondition?.name}</TokenGatingNameHeader>
        <TokenGateActionMenu right="true">
          <DropDown DropdownHandler={TaskMenuIcon}>
            <DropDownItem
              key={'token-gate-edit' + tokenGatingCondition?.id}
              onClick={() => {
                router.push(`/organization/settings/${orgId}/token-gating`, undefined, {
                  shallow: true,
                });
              }}
              style={dropdownItemStyle}
            >
              Edit
            </DropDownItem>
            {/* <DropDownItem
              key={'token-gate-delete' + tokenGatingCondition?.id}
              onClick={() => {}}
              style={dropdownItemStyle}
            >
              Remove
            </DropDownItem> */}
          </DropDown>
        </TokenGateActionMenu>
      </div>
      <TokenGateListDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Chain:</TokenGatingHeaderLabel>
          <TokenGatingNameHeader>
            <span
              style={{
                textTransform: 'capitalize',
              }}
            >
              {tokenGatingCondition?.accessCondition[0].chain}
            </span>
          </TokenGatingNameHeader>
        </TokenGateListItemDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Token:</TokenGatingHeaderLabel>
          <TokenLogoDisplay src={tokenLogo} />
          <TokenGatingNameHeader>
            <span>{tokenName ? tokenName : tokenGatingCondition?.accessCondition[0].contractAddress}</span>
          </TokenGatingNameHeader>
        </TokenGateListItemDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Min. amount to hold:</TokenGatingHeaderLabel>
          <TokenGatingNameHeader>{tokenGatingCondition?.accessCondition[0].minValue}</TokenGatingNameHeader>
        </TokenGateListItemDiv>
      </TokenGateListDiv>
    </TokenGatingElementWrapper>
  );
};
export default Roles;
