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
  # get all discord roles associated with the guilds that org is connected to
  query getOrgDiscordRoles($orgId: ID!) {
    getOrgDiscordRoles(orgId: $orgId) {
      guildId
      guildInfo {
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

export const GET_POD_DISCORD_ROLES = gql`
  # get all discord roles associated with the guilds that pod is connected to
  query getPodDiscordRoles($podId: ID!) {
    getPodDiscordRoles(podId: $podId) {
      guildId
      guildInfo {
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
  # not used
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

export const GET_ORG_INTEGRATIONS = gql`
  query getOrgIntegrations($orgId: ID!) {
    getOrgIntegrations(orgId: $orgId) {
      integrations {
        discord
        telegram
        snapshot
        github
        guildxyz
        otterspace
      }
    }
  }
`;

export const GET_POD_INTEGRATIONS = gql`
  query getPodIntegrations($podId: ID!) {
    getPodIntegrations(podId: $podId) {
      integrations {
        discord
        telegram
        snapshot
        github
        guildxyz
        otterspace
      }
    }
  }
`;

export const GET_ORG_OTTERSPACE = gql`
  query getOrgOtterspace($orgId: ID!) {
    getOrgOtterspace(orgId: $orgId) {
      raftId
    }
  }
`;
