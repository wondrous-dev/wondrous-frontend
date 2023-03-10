export const INTEGRATION_TYPES = {
  GITHUB: 'github',
  GUILD: 'guild',
  DISCORD: 'discord',
  SNAPSHOT: 'snapshot',
  TELEGRAM: 'telegram',
  OTTERSPACE: 'otterspace',
};

export const FILTER_TYPES = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const INTEGRATION_FEATURES = {
  [INTEGRATION_TYPES.GITHUB]: ['Connect Github repositories to your tasks'],
  [INTEGRATION_TYPES.GUILD]: ['Manage custom permissions and roles for your community'],
  [INTEGRATION_TYPES.DISCORD]: [
    'Send task notifications to Discord',
    'Send task comments to Discord',
    'Send task updates to Discord',
  ],
  [INTEGRATION_TYPES.SNAPSHOT]: ['Link proposals to Snapshot'],
  [INTEGRATION_TYPES.TELEGRAM]: ['Receive updates every 6 hours in Telegram'],
  [INTEGRATION_TYPES.OTTERSPACE]: ['Manage custom permissions and roles for your community'],
};
