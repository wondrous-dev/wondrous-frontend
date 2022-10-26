import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/client';

import Roles from 'components/Settings/Roles';
import { GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD, GET_ORG_DISCORD_NOTIFICATION_CONFIGS } from 'graphql/queries';
import { GET_ORG_DISCORD_ROLES } from 'graphql/queries/integration';
import { CREATE_ORG_ROLE, DELETE_ORG_ROLE, UPDATE_ORG_ROLE } from 'graphql/mutations/org';
import { Role } from 'types/common';
import permissons from 'utils/orgPermissions';
import { withAuth } from 'components/Auth/withAuth';

function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });
  // Get organization roles
  const router = useRouter();
  const { orgId } = router.query;
  const [getOrgDiscordRoles, { data: getOrgDiscordRolesData }] = useLazyQuery(GET_ORG_DISCORD_ROLES, {
    variables: {
      orgId,
    },
  });

  const [getOrgDiscordNotificationConfig, { data: getOrgDiscordConfigData }] = useLazyQuery(
    GET_ORG_DISCORD_NOTIFICATION_CONFIGS,
    {
      variables: {
        orgId,
      },
    }
  );

  const [getOrgRolesWithTokenGate, { data: getOrgRolesData }] = useLazyQuery(
    GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD,
    {
      variables: {
        orgId,
      },
      onCompleted: (data) => {
        setRoles(JSON.parse(JSON.stringify(data?.getOrgRoles)) || []);
      },
    }
  );

  // Mutation to create organization role
  const [createOrgRole] = useMutation(CREATE_ORG_ROLE, {
    onCompleted: ({ createOrgRole: role }) => {
      setToast({ ...toast, message: `${role.name} created successfully.`, show: true });
      getOrgRolesWithTokenGate();
    },
    refetchQueries: [GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
  });

  const [updateOrgRole] = useMutation(UPDATE_ORG_ROLE, {
    onCompleted: ({ updateOrgRole: role }) => {
      setToast({ ...toast, message: `${role.name} updated successfully.`, show: true });
    },
  });

  // Mutation to delete organization role
  const [deleteOrgRole] = useMutation(DELETE_ORG_ROLE, {
    onCompleted: () => {
      setToast({ ...toast, message: 'Role deleted successfully.', show: true });
    },
  });

  // Get organization roles when organization is defined
  useEffect(() => {
    if (orgId) {
      getOrgRolesWithTokenGate().then((result) => {
        if (result?.data?.getOrgRoles) {
          setRoles(JSON.parse(JSON.stringify(result?.data?.getOrgRoles)) || []);
        }
      });
      getOrgDiscordNotificationConfig();
    }
  }, [orgId, getOrgRolesWithTokenGate, getOrgDiscordNotificationConfig]);

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
      orgId={orgId}
      permissons={permissons}
      allDiscordRolesData={getOrgDiscordRolesData?.getOrgDiscordRoles}
      orgDiscordConfigData={getOrgDiscordConfigData?.getOrgDiscordNotificationConfig}
      getOrgDiscordRoles={getOrgDiscordRoles}
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
      toast={toast}
      onToastClose={() => setToast({ ...toast, show: false })}
    />
  );
}

export default withAuth(RolesPage);
