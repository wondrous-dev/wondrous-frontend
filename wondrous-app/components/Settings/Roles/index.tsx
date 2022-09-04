import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import apollo from 'services/apollo';

import {
  TokenGatingNameHeader,
  TokenGatingElementWrapper,
  TokenGateActionMenuContainer,
  TokenGateListDiv,
  TokenGateListItemDiv,
  TokenGatingHeaderLabel,
  TokenLogoDisplay,
} from 'components/Settings/TokenGating/styles';
import palette from 'theme/palette';

import { Role } from 'types/common';
import { GET_TOKEN_INFO, GET_NFT_INFO, GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries/tokenGating';
import { GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD, GET_POD_ROLES_WITH_TOKEN_GATE } from 'graphql/queries';
import {
  APPLY_TOKEN_GATING_TO_ORG_ROLE,
  APPLY_TOKEN_GATING_TO_POD_ROLE,
  REMOVE_TOKEN_GATING_FROM_ORG_ROLE,
  REMOVE_TOKEN_GATING_FROM_POD_ROLE,
} from 'graphql/mutations/tokenGating';
import {
  DISCONNECT_DISCORD_ROLE_TO_ORG_ROLE,
  CONNECT_DISCORD_ROLE_TO_ORG_ROLE,
  IMPORT_DISCORD_ROLE_AS_ORG_ROLE,
} from 'graphql/mutations/integration';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';

import CloseModalIcon from 'components/Icons/closeModal';
import styles, {
  CategoryHeader,
  CategoryRow,
  InterestButton,
  StyledDialogContent,
} from 'components/Common/UserInterestModal/styles';

import { CreateFormCancelButton, CreateFormPreviewButton } from 'components/CreateEntity/styles';
import { ErrorText } from 'components/Common';
import SettingsWrapper from 'components/Common/SidebarSettings';
import RoleLockIcon from '../../Icons/rolesLock.svg';
import { DropDown, DropDownItem } from '../../Common/dropdown';
import { TaskMenuIcon } from '../../Icons/taskMenu';
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
  ImportDiscordRoleButton,
  DiscordRoleModal,
  DiscordElementWrapper,
} from './styles';
import Switch from '../../Common/Switch';
import Accordion from '../../Common/Accordion';
import UserCheckIcon from '../../Icons/userCheckIcon';
import { HeaderBlock } from '../headerBlock';

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
  getOrgDiscordRoles?: () => any;
  orgDiscordConfigData?: any;
  allDiscordRolesData?: any;
};

function Roles({
  orgId,
  podId,
  roles,
  onCreateNewRole,
  onDeleteRole,
  onPermissionsChange,
  toast,
  onToastClose,
  permissons,
  orgDiscordConfigData,
  allDiscordRolesData,
  getOrgDiscordRoles,
}: Props) {
  const router = useRouter();

  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissionsExpanded, setNewRolePermissionsExpanded] = useState(false);
  const [newRolePermissions, setNewRolePermissions] = useState([]);
  const [tokenGatedRoleModalOpen, setTokenGatedRoleModalOpen] = useState(false);
  const [discordRoleModalOpen, setDiscordRoleModalOpen] = useState(false);
  const [discordRoleImportModalOpen, setDiscordRoleImportModalOpen] = useState(false);
  const [selectedRoleForTokenGate, setSelectedRoleForTokenGate] = useState(null);
  const [selectedRoleForDiscord, setSelectedRoleForDiscord] = useState(null);
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
    setDiscordRoleModalOpen(false);
    setDiscordRoleImportModalOpen(false);
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
      />

      {!podId && (
        <DiscordRoleSelectModal
          open={discordRoleImportModalOpen}
          allDiscordRolesData={allDiscordRolesData}
          orgId={orgId}
          podId={podId}
          onClose={handleCloseModal}
          getOrgDiscordRoles={getOrgDiscordRoles}
        />
      )}
      {!podId && (
        <DiscordRoleSelectionModal
          open={discordRoleModalOpen}
          handleClose={handleCloseModal}
          orgId={orgId}
          podId={podId}
          selectedRoleForDiscord={selectedRoleForDiscord}
          getOrgDiscordRoles={getOrgDiscordRoles}
          allDiscordRolesData={allDiscordRolesData}
        />
      )}

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
        {!podId && !orgDiscordConfigData?.guildId && (
          <ImportDiscordRoleButton
            onClick={() => {
              router.push(`/organization/settings/${orgId}/notifications`);
            }}
          >
            Connect your Discord server to import roles
          </ImportDiscordRoleButton>
        )}
        {!podId && orgDiscordConfigData?.guildId && (
          <ImportDiscordRoleButton
            onClick={() => {
              setDiscordRoleImportModalOpen(true);
            }}
          >
            Import Roles from Discord
          </ImportDiscordRoleButton>
        )}
        {roles.length ? <LabelBlock mt={80}>{roles.length} Existing roles</LabelBlock> : null}

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
                  {!podId && (
                    <DiscordOnRoleDisplay
                      discordRolesInfo={orgRole.discordRolesInfo}
                      setDiscordRoleModalOpen={setDiscordRoleModalOpen}
                      role={orgRole}
                      setSelectedRoleForDiscord={setSelectedRoleForDiscord}
                      orgDiscordConfigData={orgDiscordConfigData}
                    />
                  )}

                  {permissons.map((item) => (
                    <Permission key={item.permission}>
                      <div>
                        <PermissionTitle>{item.title}</PermissionTitle>
                        <PermissionSubtitle>{item.subTitle}</PermissionSubtitle>
                      </div>
                      <Switch
                        size="medium"
                        color="secondary"
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
}

function TokenGatingOnRoleDisplay(props) {
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
      <TokenGatingButton onClick={handleEditClick} highlighted>
        {tokenGatingCondition ? 'Edit' : 'Add token gate'}
      </TokenGatingButton>
    </RoleTokenGatingWrapper>
  );
}

function DiscordOnRoleDisplay(props) {
  const { discordRolesInfo, setDiscordRoleModalOpen, role, setSelectedRoleForDiscord, orgDiscordConfigData } = props;
  const handleEditClick = () => {
    setSelectedRoleForDiscord(role);
    setDiscordRoleModalOpen(true);
  };
  if (!orgDiscordConfigData?.guildId) {
    return <></>;
  }
  return (
    <RoleTokenGatingWrapper>
      <TitleLockIconWrapper>
        {discordRolesInfo && discordRolesInfo.length > 0 ? (
          <PermissionTitle>Connected to discord Role: {discordRolesInfo[0]?.name}</PermissionTitle>
        ) : (
          <PermissionTitle>Discord Role Connected: None</PermissionTitle>
        )}
      </TitleLockIconWrapper>

      <TokenGatingButton onClick={handleEditClick} highlighted>
        {discordRolesInfo && discordRolesInfo.length > 0 ? 'Edit' : 'Link Discord Role'}
      </TokenGatingButton>
    </RoleTokenGatingWrapper>
  );
}

function DiscordRoleSelectionModal(props) {
  const router = useRouter();
  const { open, handleClose, orgId, podId, selectedRoleForDiscord, getOrgDiscordRoles, allDiscordRolesData } = props;
  useEffect(() => {
    if (open) {
      getOrgDiscordRoles();
    }
  }, [open]);

  const handleRemoveDiscordRoleConnection = async () => {
    try {
      if (selectedRoleForDiscord?.__typename === 'OrgRole') {
        await apollo.mutate({
          mutation: DISCONNECT_DISCORD_ROLE_TO_ORG_ROLE,
          variables: {
            orgRoleId: selectedRoleForDiscord?.id,
            discordRoleId: '',
          },
          refetchQueries: [GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
        });
        console.log('triggered');
      }

      if (selectedRoleForDiscord?.__typename === 'PodRole') {
        await apollo.mutate({
          mutation: DISCONNECT_DISCORD_ROLE_TO_ORG_ROLE,
          variables: {
            orgRoleId: selectedRoleForDiscord?.id,
            discordRoleId: '',
          },
          refetchQueries: [GET_POD_ROLES_WITH_TOKEN_GATE],
        });
      }
    } catch (e) {
      console.error(e);
      return;
    }
    handleClose();
  };
  const handleElementClick = async (discordRoleId) => {
    try {
      if (selectedRoleForDiscord?.__typename === 'OrgRole') {
        await apollo.mutate({
          mutation: CONNECT_DISCORD_ROLE_TO_ORG_ROLE,
          variables: {
            orgRoleId: selectedRoleForDiscord?.id,
            discordRoleId,
          },
          refetchQueries: [GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
        });
        console.log('triggered');
      }

      if (selectedRoleForDiscord?.__typename === 'PodRole') {
        await apollo.mutate({
          mutation: CONNECT_DISCORD_ROLE_TO_ORG_ROLE,
          variables: {
            orgRoleId: selectedRoleForDiscord?.id,
            discordRoleId,
          },
          // refetchQueries: [GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD]
        });
      }
    } catch (e) {
      console.error(e);
      return;
    }
    handleClose();
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <DiscordRoleModal>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TokenGatedRoleModalTitle>Link discord Role for {selectedRoleForDiscord?.name} role</TokenGatedRoleModalTitle>
          <TokenGatingButton onClick={handleRemoveDiscordRoleConnection} highlighted={false}>
            remove
          </TokenGatingButton>
        </div>
        {allDiscordRolesData &&
          allDiscordRolesData.length > 0 &&
          allDiscordRolesData.map((discordRoleData) => (
            <DiscordElementWrapper key={discordRoleData.id} onClick={() => handleElementClick(discordRoleData.id)}>
              {discordRoleData.name}
            </DiscordElementWrapper>
          ))}
      </DiscordRoleModal>
    </Modal>
  );
}

function TokenGateRoleConfigModal(props) {
  const router = useRouter();
  const { open, handleClose, orgId, podId, selectedRoleForTokenGate } = props;
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
        await apollo.mutate({
          mutation: REMOVE_TOKEN_GATING_FROM_ORG_ROLE,
          variables: {
            orgRoleId: selectedRoleForTokenGate?.id,
          },
          refetchQueries: [GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
        });
      }

      if (selectedRoleForTokenGate?.__typename === 'PodRole') {
        await apollo.mutate({
          mutation: REMOVE_TOKEN_GATING_FROM_POD_ROLE,
          variables: {
            podRoleId: selectedRoleForTokenGate?.id,
          },
          refetchQueries: [GET_POD_ROLES_WITH_TOKEN_GATE],
        });
      }
    } catch (e) {
      console.error(e);
      return;
    }
    handleClose();
  };

  return (
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
              highlighted
            >
              create new
            </TokenGatingButton>
          </div>
        </div>
        {tokenGatingConditions.map((tokenGatingCondition) => (
          <TokenGatingModalElement
            key={tokenGatingCondition.id}
            tokenGatingCondition={tokenGatingCondition}
            selectedRoleForTokenGate={selectedRoleForTokenGate}
            handleClose={handleClose}
            orgId={orgId}
          />
        ))}
      </TokenGatedRoleModal>
    </Modal>
  );
}

function TokenGatingModalElement(props) {
  const [tokenName, setTokenName] = useState(null);
  const [tokenLogo, setTokenLogo] = useState(null);
  const { tokenGatingCondition, selectedRoleForTokenGate, handleClose, orgId } = props;
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
  const contractAddress = tokenGatingCondition?.accessCondition.contractAddress;
  const dropdownItemStyle = {
    marginRight: '12px',
    color: palette.white,
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
          refetchQueries: [GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
        });
      }

      if (selectedRoleForTokenGate?.__typename === 'PodRole') {
        await apollo.mutate({
          mutation: APPLY_TOKEN_GATING_TO_POD_ROLE,
          variables: {
            tokenGatingConditionId: tokenGatingCondition?.id,
            podRoleId: selectedRoleForTokenGate?.id,
          },
          refetchQueries: [GET_POD_ROLES_WITH_TOKEN_GATE],
        });
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
        <TokenGateActionMenuContainer right="true">
          <DropDown DropdownHandler={TaskMenuIcon}>
            <DropDownItem
              key={`token-gate-edit${tokenGatingCondition?.id}`}
              onClick={() => {
                router.push(`/organization/settings/${orgId}/token-gating`, undefined, {
                  shallow: true,
                });
              }}
              style={dropdownItemStyle}
            >
              Edit
            </DropDownItem>
          </DropDown>
        </TokenGateActionMenuContainer>
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
            <span>{tokenName || tokenGatingCondition?.accessCondition[0].contractAddress}</span>
          </TokenGatingNameHeader>
        </TokenGateListItemDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Min. amount to hold:</TokenGatingHeaderLabel>
          <TokenGatingNameHeader>{tokenGatingCondition?.accessCondition[0].minValue}</TokenGatingNameHeader>
        </TokenGateListItemDiv>
      </TokenGateListDiv>
    </TokenGatingElementWrapper>
  );
}

export function DiscordRoleSelectModal(props) {
  const { open, onClose, allDiscordRolesData, getOrgDiscordRoles, orgId, podId } = props;
  const [selectedDiscordRoles, setSelectedDiscordRoles] = useState({});
  const [importRoleError, setImportRoleError] = useState(null);

  useEffect(() => {
    if (open) {
      getOrgDiscordRoles();
    }
  }, [open]);

  const handleSelectDiscordRoles = (discordRoleId) => {
    setImportRoleError(null);
    if (discordRoleId in selectedDiscordRoles) {
      delete selectedDiscordRoles[discordRoleId];
      const newObj = { ...selectedDiscordRoles };
      setSelectedDiscordRoles(newObj);
    } else {
      selectedDiscordRoles[discordRoleId] = true;
      const newObj = { ...selectedDiscordRoles };
      setSelectedDiscordRoles(newObj);
    }
  };
  const handleDiscordRoleImport = async () => {
    const confirmed = confirm('Are you sure you want to import and create the following roles?');
    if (!confirmed) {
      return;
    }
    try {
      await apollo.mutate({
        mutation: IMPORT_DISCORD_ROLE_AS_ORG_ROLE,
        variables: {
          orgId,
          discordRoleIds: Object.keys(selectedDiscordRoles),
        },
        refetchQueries: [GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
      });
    } catch (err) {
      if (err?.graphQLErrors && err?.graphQLErrors.length > 0) {
        if (err?.graphQLErrors[0].extensions?.errorCode === 'role_already_exist') {
          setImportRoleError('Role with the same name already exist');
          return;
        }
      }
      setImportRoleError('Error occured, please try again or create roles manually');
      return;
    }
    handleClose();
  };
  const handleClose = () => {
    setImportRoleError(null);
    setSelectedDiscordRoles({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: styles.backgroundPaper,
      }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        Select roles to import
        <Box flex={1} />
        <IconButton onClick={onClose} style={styles.closeButton}>
          <CloseModalIcon style={styles.closeButtonIcon} />
        </IconButton>
      </DialogTitle>
      <StyledDialogContent>
        <CategoryHeader>Avaliable Roles:</CategoryHeader>
        <CategoryRow>
          {allDiscordRolesData &&
            allDiscordRolesData.map((discordRole) => (
              <InterestButton
                style={{
                  background: discordRole.id in selectedDiscordRoles ? '#7427FF' : '#232323',
                }}
                onClick={() => handleSelectDiscordRoles(discordRole.id)}
                key={discordRole.id}
              >
                {discordRole.name}
              </InterestButton>
            ))}
        </CategoryRow>
        {importRoleError && <ErrorText>{importRoleError}</ErrorText>}
      </StyledDialogContent>
      <DialogActions>
        <CreateFormCancelButton onClick={handleClose}>Cancel</CreateFormCancelButton>
        <CreateFormPreviewButton onClick={handleDiscordRoleImport}>Import</CreateFormPreviewButton>
      </DialogActions>
    </Dialog>
  );
}

export default Roles;
