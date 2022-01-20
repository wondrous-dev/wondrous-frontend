import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_ROLES, GET_ORG_USERS, GET_USER_ORGS } from '../../../graphql/queries/org';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import UserCheckIcon from '../../Icons/userCheckIcon';
import Accordion from '../../Common/Accordion';
import Switch from '../../Common/Switch';

import permissons from './permissons';

import {
  RolesContainer,
  CreateRole,
  CreateRoleButton,
  RoleNameBlock,
  RoleNameInput,
  RolesInputsBlock,
  Permission,
  LabelBlock,
  PermissionSubtitle,
  Permissions,
  PermissionTitle,
  Box,
  Snackbar,
  DeleteButton,
  PermissionFooter,
  Error,
} from './styles';
import { CREATE_ORG_ROLE, DELETE_ORG_ROLE, UPDATE_ORG_ROLE } from '../../../graphql/mutations/org';

const Roles = () => {
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissionsExpanded, setNewRolePermissionsExpanded] = useState(false);
  const [newRolePermissions, setNewRolePermissions] = useState([]);
  const [organizationRoles, setOrganizationRoles] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });
  // Get user organizations
  const { data: userOrgs, error: userOrgsError } = useQuery(GET_USER_ORGS);
  // Get organization roles
  const [getOrgRoles, { data: getOrgRolesData }] = useLazyQuery(GET_ORG_ROLES);
  const [updateOrgRole] = useMutation(UPDATE_ORG_ROLE, {
    onCompleted: (role) => {
      setToast({ ...toast, message: `${role.name} updated successfully.`, show: true });
    },
  });

  // Mutation to delete organization role
  const [deleteOrgRole] = useMutation(DELETE_ORG_ROLE, {
    onCompleted: () => {
      setToast({ ...toast, message: `Role deleted successfully.`, show: true });
    },
  });
  // Mutation to create organization role
  const [createOrgRole] = useMutation(CREATE_ORG_ROLE, {
    onCompleted: ({ createOrgRole: role }) => {
      setToast({ ...toast, message: `${role.name} created successfully.`, show: true });
      getOrgRoles();
    },
  });

  // TODO: Use selected organization in the future instead of the first one
  const firstOrganization = userOrgs?.getUserOrgs[0];

  // Get organization roles when organization is defined
  useEffect(() => {
    if (firstOrganization) {
      getOrgRoles({
        variables: {
          orgId: firstOrganization.id,
        },
      });
    }
  }, [firstOrganization, getOrgRoles]);

  useEffect(() => {
    if (getOrgRolesData) {
      setOrganizationRoles(JSON.parse(JSON.stringify(getOrgRolesData?.getOrgRoles)) || []);
    }
  }, [getOrgRolesData]);

  // Creates new role
  function createNewRole() {
    if (!newRoleName) {
      return;
    }

    createOrgRole({
      variables: {
        input: {
          permissions: newRolePermissions,
          orgId: firstOrganization.id,
          name: newRoleName,
        },
      },
    });

    setNewRolePermissions([]);
    setNewRoleName('');
    setNewRolePermissionsExpanded(false);
  }

  function deleteRole(orgRole) {
    const index = organizationRoles.indexOf(orgRole);

    if (index > -1) {
      const newOrganizationRoles = [...organizationRoles];
      newOrganizationRoles.splice(index, 1);

      setOrganizationRoles(newOrganizationRoles);
    }

    deleteOrgRole({ variables: { id: orgRole.id } });
  }

  function handleOrgRolePermissionChange(orgRole, permission: string, checked: boolean) {
    const permissions = [...orgRole.permissions];

    if (checked) {
      permissions.push(permission);
    } else {
      permissions.splice(permissions.indexOf(permission), 1);
    }

    orgRole.permissions = permissions;
    setOrganizationRoles(organizationRoles);

    updateOrgRole({
      variables: {
        input: {
          id: orgRole.id,
          permissions: orgRole.permissions,
          name: orgRole.name,
        },
      },
    });
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

  if (userOrgsError) {
    return (
      <SettingsWrapper>
        <HeaderBlock
          icon={<UserCheckIcon circle />}
          title="Roles"
          description="Use roles to organize contributors and admins"
        />

        <Error>Error: {userOrgsError?.graphQLErrors[0].message}</Error>
      </SettingsWrapper>
    );
  }

  return (
    <SettingsWrapper>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
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
              <CreateRoleButton onClick={createNewRole} disabled={!newRoleName} highlighted={!!newRoleName}>
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

        {organizationRoles.length ? <LabelBlock mt={120}>{organizationRoles.length} Existing roles</LabelBlock> : null}

        {organizationRoles.map((orgRole) => (
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
                      onChange={(e) => handleOrgRolePermissionChange(orgRole, item.permission, e.currentTarget.checked)}
                    />
                  </Permission>
                ))}
                <PermissionFooter>
                  <DeleteButton disabled onClick={() => deleteRole(orgRole)}>
                    Delete role
                  </DeleteButton>
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
