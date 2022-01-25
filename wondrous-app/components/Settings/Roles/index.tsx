import React, { useState } from 'react';

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
} from './styles';
import { Role } from '../../../types/common';

type Props = {
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
};

const Roles = ({
  roles,
  onCreateNewRole,
  onDeleteRole,
  onPermissionsChange,
  toast,
  onToastClose,
  permissons,
}: Props) => {
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissionsExpanded, setNewRolePermissionsExpanded] = useState(false);
  const [newRolePermissions, setNewRolePermissions] = useState([]);

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

  return (
    <SettingsWrapper>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={toast.show}
        onClose={onToastClose}
        message={toast.message}
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
              <RoleNameInput value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
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

        {roles.map((orgRole) => (
          <Box key={orgRole.id} mt={22}>
            <Accordion title={orgRole.name}>
              <Permissions>
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
        ))}
      </RolesContainer>
    </SettingsWrapper>
  );
};

export default Roles;
