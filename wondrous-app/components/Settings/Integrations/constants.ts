export const INTEGRATION_TYPES = {
  GITHUB: 'github',
  GUILD: 'guild',
  DISCORD: 'discord',
  SNAPSHOT: 'snapshot',
  TELEGRAM: 'telegram',
};

export const INTEGRATIONS = [
  {
    title: 'Discord',
    linkTitle: 'discord.com',
    url: 'https://discord.com',
    text: 'Connect your Discord account',
    type: INTEGRATION_TYPES.DISCORD,
    logo: '/images/integrations/discord-full-logo.png',
  },
  {
    title: 'Guild.xyz',
    linkTitle: 'guild.xyz',
    url: 'https://guild.xyz',
    text: 'Connect your Guild.xyz account for custom permissions and roles for your community.',
    type: INTEGRATION_TYPES.GUILD,
    logo: '/images/integrations/guild-xyz-logo.png',
  },
  {
    title: 'Github',
    linkTitle: 'github.com',
    url: 'https://github.com',
    text: 'Connect your Github account.',
    type: INTEGRATION_TYPES.GITHUB,
    logo: '/images/integrations/github-logo.png',
  },
  {
    title: 'Snapshot',
    linkTitle: 'snapshot.org',
    url: 'https://snapshot.org',
    text: 'Connect your Snapshot account.',
    type: INTEGRATION_TYPES.SNAPSHOT,
    logo: '/images/integrations/snapshot-logo.png',
  },
  {
    title: 'Telegram',
    linkTitle: 'telegram.org',
    url: 'https://telegram.org',
    text: 'Connect your Telegram account.',
    type: INTEGRATION_TYPES.TELEGRAM,
    logo: '/images/integrations/telegram-logo.png',
  },
];
