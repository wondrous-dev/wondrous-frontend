import { gql } from '@apollo/client';

export const GET_CMTY_ORG_DISCORD_CONFIG = gql`
  query getCmtyOrgDiscordConfig($orgId: ID!) {
    getCmtyOrgDiscordConfig(orgId: $orgId) {
      id
      createdAt
      orgId
      guildId
      guildInfo {
        guildId
        guildName
      }
    }
  }
`;


export const GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL = gql`
  query getCmtyOrgDiscordConfig($orgId: ID!) {
    getCmtyOrgDiscordConfig(orgId: $orgId) {
      id
      createdAt
      orgId
      guildId
    }
  }
`;
