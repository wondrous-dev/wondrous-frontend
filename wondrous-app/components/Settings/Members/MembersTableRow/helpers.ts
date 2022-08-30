import { PERMISSIONS } from 'utils/constants';
import { RoleColorsAndEmojis, ROLES } from './constants';

export const addressTag = (address: string): string => {
  const isENSName = address.endsWith('.eth');

  if (isENSName) {
    return address;
  }

  if (!address) {
    return '';
  }
  return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
};

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

export const getRoleEmoji = (role) => {
  if (!role) {
    return '';
  }
  const roleLabel = role.label || role.name;
  const correspondingRoleKey = Object.keys(ROLES).find((key) => ROLES[key] === roleLabel);

  if (correspondingRoleKey) {
    return RoleColorsAndEmojis[ROLES[correspondingRoleKey]].emoji;
  }

  return RoleColorsAndEmojis[ROLES.DEFAULT].emoji;
};

export const getRoleColor = (role) => {
  if (!role) {
    return '';
  }
  const roleLabel = role.label || role.name;
  const correspondingRoleKey = Object.keys(ROLES).find((key) => ROLES[key] === roleLabel);

  if (correspondingRoleKey) {
    return RoleColorsAndEmojis[ROLES[correspondingRoleKey]].color;
  }

  return RoleColorsAndEmojis[ROLES.DEFAULT].color;
};
