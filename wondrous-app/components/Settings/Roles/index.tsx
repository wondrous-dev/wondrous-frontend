import Tabs from 'components/Tabs';
import TokenGatingItem from 'components/TokenGatingItem';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import { useLazyQuery } from '@apollo/client';
import apollo from 'services/apollo';

import { Role } from 'types/common';
import { GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries/tokenGating';
import { GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD, GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD } from 'graphql/queries';
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
  DISCONNECT_DISCORD_ROLE_TO_POD_ROLE,
  CONNECT_DISCORD_ROLE_TO_POD_ROLE,
  IMPORT_DISCORD_ROLE_AS_POD_ROLE,
} from 'graphql/mutations/integration';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { CreateFormCancelButton, CreateFormPreviewButton } from 'components/CreateEntity/styles';
import { ErrorText } from 'components/Common';
import SettingsWrapper from 'components/Common/SidebarSettings';
import RolePill from 'components/Common/RolePill';
import AndroidSwitch from 'components/Common/AndroidSwitch';
import HeaderBlock from 'components/Settings/headerBlock';
import CloseModalIcon from 'components/Icons/closeModal';
import UserCheckIcon from 'components/Icons/userCheckIcon';
import RoleLockIcon from 'components/Icons/rolesLock.svg';
import { DiscordIcon } from 'components/Icons/discord';

import { TOKEN_GATING_CONDITION_TYPE } from 'utils/constants';
import palette from 'theme/palette';

import styles, {
  CategoryHeader,
  CategoryRow,
  InterestButton,
  StyledDialogContent,
} from 'components/Common/UserInterestModal/styles';
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
  ImportDiscordRoleButton,
  DiscordRoleModal,
  DiscordElementWrapper,
  RoleAccordion,
  PermissionTitleLabel,
  RolePermissionsList,
} from './styles';
import DeleteRoleConfirmationModal from './DeleteRoleConfirmationModal';

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
  onDeleteRole: (role: Role, callback?: () => void) => any;
  onPermissionsChange: (role: Role, permissions: string[]) => any;
  onToastClose: () => any;
  getDiscordRoles?: () => any;
  discordConfigData?: any;
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
  discordConfigData,
  allDiscordRolesData,
  getDiscordRoles,
}: Props) {
  const router = useRouter();

  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissionsExpanded, setNewRolePermissionsExpanded] = useState(false);
  const [newRolePermissions, setNewRolePermissions] = useState([]);

  const [tokenGatedRoleModalOpen, setTokenGatedRoleModalOpen] = useState(false);
  const [discordRoleModalOpen, setDiscordRoleModalOpen] = useState(false);
  const [discordRoleImportModalOpen, setDiscordRoleImportModalOpen] = useState(false);
  const [roleDeleteConfirmationModalOpen, setRoleDeleteConfirmationModalOpen] = useState(false);

  const [selectedRoleForTokenGate, setSelectedRoleForTokenGate] = useState(null);
  const [selectedRoleForDiscord, setSelectedRoleForDiscord] = useState(null);
  const [selectedRoleForDeletion, setSelectedRoleForDeletion] = useState(null);

  useEffect(() => {
    if (!roleDeleteConfirmationModalOpen) {
      setSelectedRoleForDeletion(null);
    }
  }, [roleDeleteConfirmationModalOpen]);

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

  const handleDeleteRoleButtonClick = (role: Role) => {
    setSelectedRoleForDeletion(role);
    setRoleDeleteConfirmationModalOpen(true);
  };

  const handleRoleDeletion = () => {
    onDeleteRole(selectedRoleForDeletion, () => {
      setRoleDeleteConfirmationModalOpen(false);
    });
  };

  const handleCloseModal = () => {
    setTokenGatedRoleModalOpen(false);
    setDiscordRoleModalOpen(false);
    setDiscordRoleImportModalOpen(false);
    setRoleDeleteConfirmationModalOpen(false);
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
      <DeleteRoleConfirmationModal
        isOpen={roleDeleteConfirmationModalOpen}
        handleClose={handleCloseModal}
        handleDeleteRole={handleRoleDeletion}
        roleToDelete={selectedRoleForDeletion}
      />

      {discordRoleImportModalOpen && (
        <DiscordRoleSelectModal
          open={discordRoleImportModalOpen}
          allDiscordRolesData={allDiscordRolesData}
          orgId={orgId}
          podId={podId}
          onClose={handleCloseModal}
          getDiscordRoles={getDiscordRoles}
        />
      )}
      {discordRoleModalOpen && (
        <DiscordRoleSelectionModal
          open={discordRoleModalOpen}
          handleClose={handleCloseModal}
          orgId={orgId}
          podId={podId}
          selectedRoleForDiscord={selectedRoleForDiscord}
          getDiscordRoles={getDiscordRoles}
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
              <RoleNameInput placeholder="Create a new role" value={newRoleName} onChange={handleRoleNameChange} />
              <CreateRoleButton onClick={handleCreateNewRoleClick} disabled={!newRoleName} highlighted={!!newRoleName}>
                Create role
              </CreateRoleButton>
            </CreateRole>
          </RoleNameBlock>
        </RolesInputsBlock>
        <RoleAccordion
          title="Select permissions"
          disabled={!newRoleName}
          expanded={newRolePermissionsExpanded}
          onChange={(e, expanded) => setNewRolePermissionsExpanded(expanded)}
        >
          <Permissions>
            <RolePermissionsList>
              {permissons.map((item, idx) => {
                const arePermissionsLengthEven = permissons.length % 2 === 0;
                const showBorder = arePermissionsLengthEven
                  ? idx !== permissons.length - 1 && idx !== permissons.length - 2
                  : idx !== permissons.length - 1;

                return (
                  <Permission key={item.permission} showBorder={showBorder}>
                    <div>
                      <PermissionTitle>{item.title}</PermissionTitle>
                      <PermissionSubtitle>{item.subTitle}</PermissionSubtitle>
                    </div>
                    <AndroidSwitch
                      size="medium"
                      checked={newRolePermissions.includes(item.permission)}
                      onChange={(e) => handleNewRolePermissionChange(item.permission, e.currentTarget.checked)}
                    />
                  </Permission>
                );
              })}
            </RolePermissionsList>
          </Permissions>
        </RoleAccordion>
        {!discordConfigData?.length && (
          <ImportDiscordRoleButton
            onClick={() => {
              console.log('sdfa', podId);
              if (podId) {
                router.push(`/pod/settings/${podId}/notifications`);
              } else if (orgId) {
                router.push(`/organization/settings/${orgId}/notifications`);
              }
            }}
          >
            Connect your Discord server to import roles
          </ImportDiscordRoleButton>
        )}
        {!!discordConfigData?.length && (
          <ImportDiscordRoleButton
            onClick={() => {
              setDiscordRoleImportModalOpen(true);
            }}
          >
            <DiscordIcon fill={palette.highlightBlue} />
            Import Roles from Discord
          </ImportDiscordRoleButton>
        )}

        {roles.length ? (
          <LabelBlock pt={28} sx={{ borderTop: `1px solid ${palette.black92}` }}>
            {roles.length} Existing roles
          </LabelBlock>
        ) : null}

        <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {roles.map(
            (
              orgRole // this isn't org role, i think it's both
            ) => (
              <Box key={orgRole.id}>
                <RoleAccordion
                  title={
                    <TitleLockIconWrapper>
                      <RolePill roleName={orgRole.name} />
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
                    <DiscordOnRoleDisplay
                      discordRolesInfo={orgRole.discordRolesInfo}
                      setDiscordRoleModalOpen={setDiscordRoleModalOpen}
                      role={orgRole}
                      setSelectedRoleForDiscord={setSelectedRoleForDiscord}
                      discordConfigData={discordConfigData}
                    />
                    <RolePermissionsList>
                      {permissons.map((item, idx) => {
                        const arePermissionsLengthEven = permissons.length % 2 === 0;
                        const showBorder = arePermissionsLengthEven
                          ? idx !== permissons.length - 1 && idx !== permissons.length - 2
                          : idx !== permissons.length - 1;
                        return (
                          <Permission key={item.permission} showBorder={showBorder}>
                            <div>
                              <PermissionTitle>{item.title}</PermissionTitle>
                              <PermissionSubtitle>{item.subTitle}</PermissionSubtitle>
                            </div>
                            <AndroidSwitch
                              size="medium"
                              color="secondary"
                              checked={orgRole.permissions.includes(item.permission)}
                              onChange={(e) =>
                                handleRolePermissionChange(orgRole, item.permission, e.currentTarget.checked)
                              }
                            />
                          </Permission>
                        );
                      })}
                    </RolePermissionsList>
                  </Permissions>
                  <PermissionFooter>
                    <DeleteButton onClick={() => handleDeleteRoleButtonClick(orgRole)}>Delete role</DeleteButton>
                  </PermissionFooter>
                </RoleAccordion>
              </Box>
            )
          )}
        </Grid>
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
            <PermissionTitle>
              Active Token Gate: <PermissionTitleLabel>{tokenGatingCondition?.name}</PermissionTitleLabel>
            </PermissionTitle>
            <RoleLockIcon />
          </>
        ) : (
          <PermissionTitle>
            Token Gating: <PermissionTitleLabel isInactive>Inactive</PermissionTitleLabel>
          </PermissionTitle>
        )}
      </TitleLockIconWrapper>
      <TokenGatingButton onClick={handleEditClick} highlighted>
        {tokenGatingCondition ? 'Edit' : 'Add token gate'}
      </TokenGatingButton>
    </RoleTokenGatingWrapper>
  );
}

function DiscordOnRoleDisplay(props) {
  const { discordRolesInfo, setDiscordRoleModalOpen, role, setSelectedRoleForDiscord, discordConfigData } = props;
  const handleEditClick = () => {
    setSelectedRoleForDiscord(role);
    setDiscordRoleModalOpen(true);
  };
  if (!discordConfigData?.length) {
    return <></>;
  }
  return (
    <RoleTokenGatingWrapper>
      <TitleLockIconWrapper>
        {discordRolesInfo && discordRolesInfo.length > 0 ? (
          <PermissionTitle>
            Connected to discord Role: <PermissionTitleLabel>{discordRolesInfo[0]?.name}</PermissionTitleLabel>
          </PermissionTitle>
        ) : (
          <PermissionTitle>
            Discord Role Connected: <PermissionTitleLabel isNone>None</PermissionTitleLabel>
          </PermissionTitle>
        )}
      </TitleLockIconWrapper>

      <TokenGatingButton onClick={handleEditClick} highlighted>
        {discordRolesInfo && discordRolesInfo.length > 0 ? 'Edit' : 'Link Discord Role'}
      </TokenGatingButton>
    </RoleTokenGatingWrapper>
  );
}

function DiscordRoleSelectionModal(props) {
  // for connecting single discord role to wonder role
  const router = useRouter();
  const { open, handleClose, orgId, podId, selectedRoleForDiscord, getDiscordRoles, allDiscordRolesData } = props;
  useEffect(() => {
    if (open) {
      getDiscordRoles();
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
      }

      if (selectedRoleForDiscord?.__typename === 'PodRole') {
        await apollo.mutate({
          mutation: DISCONNECT_DISCORD_ROLE_TO_POD_ROLE,
          variables: {
            podRoleId: selectedRoleForDiscord?.id,
            discordRoleId: '',
          },
          refetchQueries: [GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
        });
      }
    } catch (e) {
      console.error(e);
      return;
    }
    handleClose();
  };
  const handleElementClick = async (discordRoleId, guildId) => {
    try {
      if (selectedRoleForDiscord?.__typename === 'OrgRole') {
        await apollo.mutate({
          mutation: CONNECT_DISCORD_ROLE_TO_ORG_ROLE,
          variables: {
            orgRoleId: selectedRoleForDiscord?.id,
            discordRoleId,
            guildId,
          },
          refetchQueries: [GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
        });
      }

      if (selectedRoleForDiscord?.__typename === 'PodRole') {
        await apollo.mutate({
          mutation: CONNECT_DISCORD_ROLE_TO_POD_ROLE,
          variables: {
            podRoleId: selectedRoleForDiscord?.id,
            discordRoleId,
            guildId,
          },
          refetchQueries: [GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
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
          allDiscordRolesData.map((discordRoleData, idx) => (
            <Grid display="flex" gap="10px" key={idx} direction="column">
              <Typography fontSize="18px" color="white" fontWeight={600}>
                {discordRoleData?.guildInfo?.guildName}
              </Typography>
              <Box>
                {discordRoleData?.roles?.map((role) => (
                  <DiscordElementWrapper
                    key={role.id}
                    onClick={() => handleElementClick(role.id, discordRoleData?.guildId)}
                  >
                    {role.name}
                  </DiscordElementWrapper>
                ))}
              </Box>
            </Grid>
          ))}
      </DiscordRoleModal>
    </Modal>
  );
}

function TokenGateRoleConfigModal(props) {
  const router = useRouter();
  const { open, handleClose, orgId, podId, selectedRoleForTokenGate } = props;
  const [tokenGatingConditions, setTokenGatingConditions] = useState([]);
  const [selectedTab, setSelectedTab] = useState(TOKEN_GATING_CONDITION_TYPE.TOKEN_GATE);
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
          refetchQueries: [GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
        });
      }
    } catch (e) {
      console.error(e);
      return;
    }
    handleClose();
  };

  const handleTokenGatingConditionClick = async (tokenGatingCondition) => {
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
          refetchQueries: [GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
        });
      }
    } catch (e) {
      console.error(e);
      return;
    }
    handleClose();
  };

  const tokenGatingConditionsByType = useMemo(
    () => tokenGatingConditions.filter((r) => (r.type || TOKEN_GATING_CONDITION_TYPE.TOKEN_GATE) === selectedTab),
    [selectedTab, tokenGatingConditions]
  );

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

        <Tabs
          value={selectedTab}
          withMargin={false}
          onChange={(e, tab) => setSelectedTab(tab)}
          tabs={[
            { label: 'Token gate', value: TOKEN_GATING_CONDITION_TYPE.TOKEN_GATE },
            { label: 'Guild.xyz', value: TOKEN_GATING_CONDITION_TYPE.GUILD },
          ]}
        />

        {tokenGatingConditionsByType.map((tokenGatingCondition) => (
          <TokenGatingItem
            key={tokenGatingCondition.id}
            tokenGatingCondition={tokenGatingCondition}
            onEdit={() => {
              router.push(`/organization/settings/${orgId}/token-gating`, undefined, {
                shallow: true,
              });
            }}
            onClick={() => handleTokenGatingConditionClick(tokenGatingCondition)}
          />
        ))}
      </TokenGatedRoleModal>
    </Modal>
  );
}

export function DiscordRoleSelectModal(props) {
  // for importing multiple discord roles into pod/org
  const { open, onClose, allDiscordRolesData, getDiscordRoles, orgId, podId } = props;
  const [selectedDiscordRoles, setSelectedDiscordRoles] = useState({});
  const [importRoleError, setImportRoleError] = useState(null);

  useEffect(() => {
    if (open) {
      getDiscordRoles();
    }
  }, [open]);

  const handleSelectDiscordRoles = (discordRoleId, guildId) => {
    setImportRoleError(null);
    if (discordRoleId in selectedDiscordRoles) {
      delete selectedDiscordRoles[discordRoleId];
      const newObj = { ...selectedDiscordRoles };
      setSelectedDiscordRoles(newObj);
    } else {
      selectedDiscordRoles[discordRoleId] = {
        value: true,
        guildId,
      };
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
      console.log(podId, orgId);
      if (podId) {
        await apollo.mutate({
          mutation: IMPORT_DISCORD_ROLE_AS_POD_ROLE,
          variables: {
            input: {
              podId,
              discordRoleGuildIds: Object.keys(selectedDiscordRoles).map((discordRoleId) => ({
                roleId: discordRoleId,
                guildId: selectedDiscordRoles[discordRoleId].guildId,
              })),
            },
          },
          refetchQueries: [GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
        });
      } else if (orgId) {
        await apollo.mutate({
          mutation: IMPORT_DISCORD_ROLE_AS_ORG_ROLE,
          variables: {
            input: {
              orgId,
              discordRoleGuildIds: Object.keys(selectedDiscordRoles).map((discordRoleId) => ({
                roleId: discordRoleId,
                guildId: selectedDiscordRoles[discordRoleId].guildId,
              })),
            },
          },
          refetchQueries: [GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
        });
      }
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
        <CategoryRow style={{ flexDirection: 'column', width: '100%' }}>
          {allDiscordRolesData &&
            allDiscordRolesData.map((discordRole) => (
              <Grid display="flex" gap="10px" direction="column" width="100%">
                <Typography fontWeight="600" fontSize="18px" color="white">
                  {discordRole?.guildInfo?.guildName}
                </Typography>
                <CategoryRow>
                  {discordRole?.roles?.map((role) => (
                    <InterestButton
                      style={{
                        background: role.id in selectedDiscordRoles ? '#7427FF' : '#232323',
                      }}
                      onClick={() => handleSelectDiscordRoles(role.id, discordRole?.guildId)}
                      key={role.id}
                    >
                      {role.name}
                    </InterestButton>
                  ))}
                </CategoryRow>
              </Grid>
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
