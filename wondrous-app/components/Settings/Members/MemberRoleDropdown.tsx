import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_ORG_ROLE } from 'graphql/mutations/org';
import { UPDATE_USER_POD_ROLE } from 'graphql/mutations/pod';
import { PERMISSIONS } from 'utils/constants';
import { useSettings } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import DropdownSelect from 'components/Common/DropdownSelect';
import ArrowDropDownIcon from 'components/Icons/arrowDropDown';
import { filterRoles } from './helpers';

function MemberRoleDropdown(props) {
  const { existingRole, roleList, userId, podId, isPod } = props;
  const [role, setRole] = useState(existingRole?.id);
  const [updateUserOrgRole] = useMutation(UPDATE_USER_ORG_ROLE);
  const [updateUserPodRole] = useMutation(UPDATE_USER_POD_ROLE);
  const isOwner = existingRole?.permissions.includes(PERMISSIONS.FULL_ACCESS);
  const settings = useSettings();
  const orgId = props?.orgId || settings?.pod?.orgId;
  const loggedInUserPermissions = settings?.userPermissionsContext;
  const permissions = parseUserPermissionContext({
    userPermissionsContext: loggedInUserPermissions,
    orgId,
    podId,
  });
  const userIsOwner = permissions.includes(PERMISSIONS.FULL_ACCESS);

  const MenuProps = {
    disableScrollLock: true,
    PaperProps: {
      style: {
        borderRadius: '6px',
        border: '1px solid #6A6A6A',
        maxHeight: '250px',
        background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
        padding: '0 7px',
      },
    },
  };

  useEffect(() => {
    if (existingRole?.id) {
      setRole(existingRole?.id);
    }
  }, [existingRole?.id]);

  return (
    <DropdownSelect
      value={role}
      setValue={(roleId) => {
        setRole(roleId);
        if (podId) {
          updateUserPodRole({
            variables: {
              input: {
                userId,
                podId,
                roleId,
              },
            },
          });
        } else {
          updateUserOrgRole({
            variables: {
              input: {
                userId,
                orgId,
                roleId,
              },
            },
          });
        }
      }}
      MenuProps={MenuProps}
      IconComponent={() => <ArrowDropDownIcon style={{ height: '7px' }} fill="#CCBBFF" />}
      labelText={isOwner && !role ? 'Owner' : 'Choose your role'}
      options={filterRoles(roleList, isOwner, userIsOwner)}
      disabled={isOwner}
      formSelectStyle={{
        height: 'auto',
        marginTop: '-20px',
        maxWidth: '180px',
      }}
    />
  );
}

export default MemberRoleDropdown;
