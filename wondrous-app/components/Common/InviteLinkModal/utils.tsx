import { PERMISSIONS } from 'utils/constants';

export enum LinkType {
  PUBLIC = 'public',
  ONE_TIME = 'one_time',
}

export const putDefaultRoleOnTop = (roles, permissions) => {
  // this also filters roles by permissions
  if (!roles) return [];
  const newRoles = [...roles];
  const filteredRoles = newRoles.filter((role) => {
    if (role?.permissions?.includes(PERMISSIONS.FULL_ACCESS) && !permissions.includes(PERMISSIONS.FULL_ACCESS)) {
      return false;
    }
    return true;
  });

  let defaultRole;
  let defaultRoleIndex;
  filteredRoles.forEach((role, index) => {
    if (role?.default) {
      defaultRole = { ...role };
      defaultRoleIndex = index;
    }
  });
  if (defaultRole && defaultRoleIndex) {
    filteredRoles?.splice(defaultRoleIndex, 1);
    filteredRoles?.unshift(defaultRole);
  }
  return filteredRoles;
};
