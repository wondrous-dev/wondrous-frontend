import { gql } from '@apollo/client';

export const GET_TWITTER_CHALLENGE_CODE = gql`
  query getTwitterCallengeCode {
    getTwitterCallengeCode {
      challengeCode
    }
  }
`;

export const GET_ORG_SNAPSHOT_INFO = gql`
  query getOrgSnapshotInfo($orgId: ID) {
    getOrgSnapshotInfo(orgId: $orgId) {
      snapshotEns
      name
      symbol
    }
  }
`;

export const GET_ORG_DISCORD_ROLES = gql`
  query getOrgDiscordRoles($orgId: ID!) {
    getOrgDiscordRoles(orgId: $orgId) {
      guildId
      channelId
      channelInfo {
        channelName
        guildName
      }
      roles {
        id
        name
        color
        permissions
      }
    }
  }
`;

export const GET_ORG_ROLES_CLAIMABLE_BY_DISCORD = gql`
  query getOrgRolesClaimableByDiscord($orgId: ID!) {
    getOrgRolesClaimableByDiscord(orgId: $orgId) {
      id
      name
      permissions
      discordRolesInfo {
        id
        name
      }
    }
  }
`;

export const GET_ORG_NOTION_DATABASES = gql`
  query getOrgNotionDatabases($orgId: ID!) {
    getOrgNotionDatabases(orgId: $orgId) {
      id
      title
      createdTime
      lastEditedTime
    }
  }
`;

export const GET_POD_NOTION_DATABASES = gql`
  query getPodNotionDatabases($podId: ID!) {
    getPodNotionDatabases(podId: $podId) {
      id
      title
      createdTime
      lastEditedTime
    }
  }
`;

export const GET_ORG_NOTION_WORKSPACE = gql`
  query getOrgNotionWorkspace($orgId: ID!) {
    getOrgNotionWorkspace(orgId: $orgId) {
      id
      name
      icon
    }
  }
`;

export const GET_POD_NOTION_WORKSPACE = gql`
  query getPodNotionWorkspace($podId: ID!) {
    getPodNotionWorkspace(podId: $podId) {
      id
      name
      icon
    }
  }
`;

export const GET_ORG_GUILD = gql`
  query getOrgGuild($orgId: ID!) {
    getOrgGuild(orgId: $orgId) {
      guildId
    }
  }
`;
