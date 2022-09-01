import { PERMISSIONS } from 'utils/constants';

export const filterRoles = (roles, isOwner, userIsOwner) => {
  if (!roles) {
    return [];
  }
  return roles
    .filter((role) => {
      if (isOwner) {
        return true;
      }
      const hasOwnerPermissions = role?.permissions?.includes(PERMISSIONS.FULL_ACCESS);
      if (hasOwnerPermissions) {
        if (userIsOwner) {
          return true;
        }
        return false;
      }
      return true;
    })
    .map((role) => ({ label: role?.name, value: role?.id }));
};
