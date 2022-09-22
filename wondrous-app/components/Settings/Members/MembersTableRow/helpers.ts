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
  if (!role) {
    return '';
  }
  const roleLabel = role.label || role.name;
  const correspondingRoleKey = Object.keys(ROLES).find((key) => ROLES[key] === roleLabel);

  if (correspondingRoleKey) {
    return ROLE_COLORS_AND_EMOJIS[ROLES[correspondingRoleKey]].emoji;
  }

  return ROLE_COLORS_AND_EMOJIS[ROLES.DEFAULT].emoji;
};

export const getRoleEmojiByName = (roleName) => {
  if (!roleName) {
    return '';
  }
  const correspondingRoleKey = Object.keys(ROLES).find((key) => ROLES[key] === roleName);

  if (correspondingRoleKey) {
    return ROLE_COLORS_AND_EMOJIS[ROLES[correspondingRoleKey]].emoji;
  }

  return ROLE_COLORS_AND_EMOJIS[ROLES.DEFAULT].emoji;
};

export const getRoleColor = (role) => {
  if (!role) {
    return '';
  }
  const roleLabel = role.label || role.name;
  const correspondingRoleKey = Object.keys(ROLES).find((key) => ROLES[key] === roleLabel);

  if (correspondingRoleKey) {
    return ROLE_COLORS_AND_EMOJIS[ROLES[correspondingRoleKey]].color;
  }

  return ROLE_COLORS_AND_EMOJIS[ROLES.DEFAULT].color;
};

export const getRoleColorByName = (roleName) => {
  if (!roleName) {
    return '';
  }
  const correspondingRoleKey = Object.keys(ROLES).find((key) => ROLES[key] === roleName);

  if (correspondingRoleKey) {
    return ROLE_COLORS_AND_EMOJIS[ROLES[correspondingRoleKey]].color;
  }

  return ROLE_COLORS_AND_EMOJIS[ROLES.DEFAULT].color;
};
