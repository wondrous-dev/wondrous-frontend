import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

import Roles from 'components/Settings/Roles';
import { GET_POD_ROLES_WITH_TOKEN_GATE, GET_POD_BY_ID } from 'graphql/queries';
import { Role } from 'types/common';
import { CREATE_POD_ROLE, DELETE_POD_ROLE, UPDATE_POD_ROLE } from 'graphql/mutations/pod';
import permissons from 'utils/podPermissions';
import { withAuth } from 'components/Auth/withAuth';

function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [pod, setPod] = useState(null);
  const router = useRouter();
  const { podId } = router.query;
  const [getPodRolesWithTokenGate, { data: getPodRolesData }] = useLazyQuery(GET_POD_ROLES_WITH_TOKEN_GATE, {
    variables: {
      podId,
    },
    onCompleted: (data) => {
      setRoles(JSON.parse(JSON.stringify(getPodRolesData?.getPodRoles)) || []);
    },
  });
  const [getPodById, { data: getPodData, loading }] = useLazyQuery(GET_POD_BY_ID, {
    onCompleted: (data) => {
      if (data?.getPodById) {
        setPod(data?.getPodById);
      }
    },
  });

  useEffect(() => {
    if (podId) {
      getPodById({
        variables: {
          podId,
        },
      });
    }
  }, [podId]);

  const [createPodRole] = useMutation(CREATE_POD_ROLE, {
    onCompleted: ({ createPodRole: role }) => {
      setToast({ ...toast, message: `${role.name} created successfully.`, show: true });
      getPodRolesWithTokenGate();
    },
    refetchQueries: [GET_POD_ROLES_WITH_TOKEN_GATE],
  });

  const [updatePodRole] = useMutation(UPDATE_POD_ROLE, {
    onCompleted: ({ updatePodRole: role }) => {
      setToast({ ...toast, message: `${role.name} updated successfully.`, show: true });
    },
  });

  const [deletePodRole] = useMutation(DELETE_POD_ROLE, {
    onCompleted: () => {
      setToast({ ...toast, message: 'Role deleted successfully.', show: true });
    },
  });

  useEffect(() => {
    if (podId) {
      getPodRolesWithTokenGate();
    }
  }, [podId, getPodRolesWithTokenGate]);

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
      orgId={pod?.orgId}
      podId={pod?.id}
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
      toast={toast}
      onToastClose={() => setToast({ ...toast, show: false })}
    />
  );
}

export default withAuth(RolesPage);
