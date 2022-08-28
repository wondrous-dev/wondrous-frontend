import palette from 'theme/palette';

export const ROLES = {
  OWNER: 'owner',
  CORE_TEAM: 'core team',
  CONTRIBUTOR: 'contributor',
  DEFAULT: 'default', // this is for any role other than the above
};

export const RoleColorsAndEmojis = {
  [ROLES.OWNER]: {
    color: palette.green300,
    emoji: '🔑',
  },
  [ROLES.CORE_TEAM]: {
    color: palette.violet210,
    emoji: '🔮',
  },
  [ROLES.CONTRIBUTOR]: {
    color: palette.highlightOrange,
    emoji: '✨',
  },
  [ROLES.DEFAULT]: {
    color: palette.highlightBlue,
    emoji: '🐦',
  },
};
