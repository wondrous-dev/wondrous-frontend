import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/client';

import Roles from '../../../../components/Settings/Roles';
import { GET_ORG_ROLES } from '../../../../graphql/queries';
import { CREATE_ORG_ROLE, DELETE_ORG_ROLE, UPDATE_ORG_ROLE } from '../../../../graphql/mutations/org';
import { Role } from '../../../../types/common';
import permissons from '../../../../utils/orgPermissions';
import { useSnackbarAlert } from '@components/Common/SnackbarAlert';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [setSnackbarAlert] = useSnackbarAlert();
  // Get organization roles
  const router = useRouter();
  const { orgId } = router.query;
  const [getOrgRoles, { data: getOrgRolesData }] = useLazyQuery(GET_ORG_ROLES, {
    variables: {
      orgId,
    },
  });

  // Mutation to create organization role
  const [createOrgRole] = useMutation(CREATE_ORG_ROLE, {
    onCompleted: ({ createOrgRole }) => {
      setSnackbarAlert({
        message: `${createOrgRole.name} created successfully.`,
        open: true,
      });
      getOrgRoles();
    },
    onError: () => {
      setSnackbarAlert({
        message: 'Something went wrong.',
        open: true,
        severity: 'error',
      });
    },
  });

  const [updateOrgRole] = useMutation(UPDATE_ORG_ROLE, {
    onCompleted: ({ updateOrgRole }) => {
      setSnackbarAlert({
        message: `${updateOrgRole.name} updated successfully.`,
        open: true,
      });
    },
    onError: () => {
      setSnackbarAlert({
        message: 'Something went wrong.',
        open: true,
        severity: 'error',
      });
    },
  });

  // Mutation to delete organization role
  const [deleteOrgRole] = useMutation(DELETE_ORG_ROLE, {
    onCompleted: () => {
      setSnackbarAlert({
        message: `Role deleted successfully.`,
        open: true,
      });
    },
    onError: () => {
      setSnackbarAlert({
        message: 'Something went wrong.',
        open: true,
        severity: 'error',
      });
    },
  });

  // Get organization roles when organization is defined
  useEffect(() => {
    if (orgId) {
      getOrgRoles();
    }
  }, [orgId, getOrgRoles]);

  useEffect(() => {
    if (getOrgRolesData) {
      setRoles(JSON.parse(JSON.stringify(getOrgRolesData?.getOrgRoles)) || []);
    }
  }, [getOrgRolesData]);

  function deleteRole(role: Role) {
    const index = roles.indexOf(role);

    if (index > -1) {
      const newOrganizationRoles = [...roles];
      newOrganizationRoles.splice(index, 1);

      setRoles(newOrganizationRoles);
    }

    deleteOrgRole({ variables: { id: role.id } });
  }

  function updateRolePermissions(role: Role, permissions: string[]) {
    role.permissions = permissions;
    setRoles([...roles]);

    updateOrgRole({
      variables: {
        input: {
          id: role.id,
          permissions: role.permissions,
          name: role.name,
        },
      },
    });
  }

  return (
    <Roles
      roles={roles}
      permissons={permissons}
      onCreateNewRole={(name: string, permissions: string[]) => {
        createOrgRole({
          variables: {
            input: {
              permissions,
              orgId,
              name,
            },
          },
        });
      }}
      onPermissionsChange={updateRolePermissions}
      onDeleteRole={deleteRole}
    />
  );
};

export default RolesPage;
