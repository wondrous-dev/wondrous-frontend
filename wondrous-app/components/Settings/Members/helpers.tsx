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
      } else {
        return true;
      }
    })
    .map((role) => {
      return { label: role?.name, value: role?.id };
    });
};
