import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';

import Roles from '../../../../components/Settings/Roles';
import { GET_POD_ROLES } from '../../../../graphql/queries';
import { Role } from '../../../../types/common';
import permissons from './permissons';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [getPodRoles, { data: getPodRolesData }] = useLazyQuery(GET_POD_ROLES);
  const router = useRouter();
  const { podId } = router.query;

  useEffect(() => {
    if (podId) {
      getPodRoles({
        variables: {
          podId,
        },
      });
    }
  }, [podId, getPodRoles]);

  useEffect(() => {
    if (getPodRolesData) {
      setRoles(JSON.parse(JSON.stringify(getPodRolesData?.getPodRoles)) || []);
    }
  }, [getPodRolesData]);

  // Creates new role
  function createNewRole(name: string, permissions: string[]) {
    console.log('New role', arguments);
    // createOrgRole({
    //   variables: {
    //     input: {
    //       permissions,
    //       orgId,
    //       name,
    //     },
    //   },
    // });
  }

  function deleteRole(role: Role) {
    const index = roles.indexOf(role);

    if (index > -1) {
      const newOrganizationRoles = [...roles];
      newOrganizationRoles.splice(index, 1);

      setRoles(newOrganizationRoles);
    }

    console.log('delete Role', role);
    // deleteOrgRole({ variables: { id: role.id } });
  }

  function updateRolePermissions(role: Role, permissions: string[]) {
    role.permissions = permissions;
    setRoles([...roles]);

    console.log('updateRolePermissions', arguments)

    // updateOrgRole({
    //   variables: {
    //     input: {
    //       id: role.id,
    //       permissions: role.permissions,
    //       name: role.name,
    //     },
    //   },
    // });
  }

  return (
    <Roles
      roles={roles}
      permissons={permissons}
      onCreateNewRole={createNewRole}
      onDeleteRole={deleteRole}
      onPermissionsChange={updateRolePermissions}
      toast={toast}
      onToastClose={() => setToast({ ...toast, show: false })}
    />
  );
};

export default RolesPage;
