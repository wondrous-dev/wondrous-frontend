import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/client';

import Roles from '../../../../components/Settings/Roles';
import { GET_POD_ROLES } from '../../../../graphql/queries';
import { Role } from '../../../../types/common';
import { CREATE_POD_ROLE, DELETE_POD_ROLE, UPDATE_POD_ROLE } from '../../../../graphql/mutations/pod';
import permissons from '../../../../utils/podPermissions';
import { useSnackbarAlert } from '@components/Common/SnackbarAlert';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [setSnackbarAlert] = useSnackbarAlert();
  const router = useRouter();
  const { podId } = router.query;
  const [getPodRoles, { data: getPodRolesData }] = useLazyQuery(GET_POD_ROLES, {
    variables: {
      podId,
    },
  });

  const [createPodRole] = useMutation(CREATE_POD_ROLE, {
    onCompleted: ({ createPodRole: role }) => {
      setSnackbarAlert({
        message: `${role.name} role created successfully.`,
        open: true,
      });
      getPodRoles();
    },
    onError: () => {
      setSnackbarAlert({
        message: 'Something went wrong.',
        open: true,
        severity: 'error',
      });
    },
  });

  const [updatePodRole] = useMutation(UPDATE_POD_ROLE, {
    onCompleted: ({ updatePodRole: role }) => {
      setSnackbarAlert({
        message: `${role.name} updated successfully.`,
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

  const [deletePodRole] = useMutation(DELETE_POD_ROLE, {
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

  useEffect(() => {
    if (podId) {
      getPodRoles();
    }
  }, [podId, getPodRoles]);

  useEffect(() => {
    if (getPodRolesData) {
      setRoles(JSON.parse(JSON.stringify(getPodRolesData?.getPodRoles)) || []);
    }
  }, [getPodRolesData]);

  function updateRolePermissions(role: Role, permissions: string[]) {
    role.permissions = permissions;
    setRoles([...roles]);

    updatePodRole({
      variables: {
        input: {
          id: role.id,
          permissions: role.permissions,
          name: role.name,
        },
      },
    });
  }

  function deleteRole(role: Role) {
    const index = roles.indexOf(role);

    if (index > -1) {
      const newOrganizationRoles = [...roles];
      newOrganizationRoles.splice(index, 1);

      setRoles(newOrganizationRoles);
    }

    deletePodRole({ variables: { id: role.id } });
  }

  return (
    <Roles
      roles={roles}
      permissons={permissons}
      onCreateNewRole={(name: string, permissions: string[]) => {
        createPodRole({
          variables: {
            input: {
              permissions,
              podId,
              name,
            },
          },
        });
      }}
      onDeleteRole={deleteRole}
      onPermissionsChange={updateRolePermissions}
    />
  );
};

export default RolesPage;
