import { PERMISSIONS, ROLE_COLORS_AND_EMOJIS, ROLES } from 'utils/constants';

export const getAddressToDisplay = (address: string): string => {
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

      return !hasOwnerPermissions || (hasOwnerPermissions && userIsOwner);
    })
    .map((role) => ({ label: role?.name, value: role?.id }));
};

export const getRoleEmoji = (role) => {
  // role is either the role object or rolename
  if (!role) {
    return '';
  }

  let correspondingRoleKey;
  if (typeof role === 'string') {
    correspondingRoleKey = Object.keys(ROLES).find((key) => ROLES[key] === role);
  } else {
    const roleLabel = role.label || role.name;
    correspondingRoleKey = Object.keys(ROLES).find((key) => ROLES[key] === roleLabel);
  }

  if (correspondingRoleKey) {
    return ROLE_COLORS_AND_EMOJIS[ROLES[correspondingRoleKey]].emoji;
  }

  return ROLE_COLORS_AND_EMOJIS[ROLES.DEFAULT].emoji;
};

export const getRoleColor = (role) => {
  // role is either the role object or rolename
  if (!role) {
    return ROLE_COLORS_AND_EMOJIS[ROLES.NO_ROLE].color;
  }
  let correspondingRoleKey;
  if (typeof role === 'string') {
    correspondingRoleKey = Object.keys(ROLES).find((key) => ROLES[key] === role);
  } else {
    const roleLabel = role.label || role.name;
    correspondingRoleKey = Object.keys(ROLES).find((key) => ROLES[key] === roleLabel);
  }

  if (correspondingRoleKey) {
    return ROLE_COLORS_AND_EMOJIS[ROLES[correspondingRoleKey]].color;
  }

  return ROLE_COLORS_AND_EMOJIS[ROLES.DEFAULT].color;
};
