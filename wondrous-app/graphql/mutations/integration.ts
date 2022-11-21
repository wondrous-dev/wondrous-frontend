import { gql } from '@apollo/client';

export const VERIFY_TWITTER = gql`
  mutation verifyTwitter($code: String) {
    verifyTwitter(code: $code) {
      success
    }
  }
`;

export const VERIFY_USER_TWEET = gql`
  mutation verifyUserTweet {
    verifyUserTweet {
      success
    }
  }
`;

export const CONNECT_SNAPSHOT_TO_ORG = gql`
  mutation connectSnapshotToOrg($orgId: ID, $input: SnapshotConnectInput) {
    connectSnapshotToOrg(orgId: $orgId, input: $input) {
      snapshotEns
      name
      symbol
    }
  }
`;

export const DISCONNECT_SNAPSHOT_TO_ORG = gql`
  mutation disconnectSnapshotToOrg($orgId: ID) {
    disconnectSnapshotToOrg(orgId: $orgId) {
      success
    }
  }
`;

export const LINKE_PROPOSAL_TO_SNAPSHOT = gql`
  mutation linkProposalToSnapshot($proposalId: ID!, $snapshotId: String) {
    linkProposalToSnapshot(proposalId: $proposalId, snapshotId: $snapshotId) {
      id
    }
  }
`;

export const UNLINKE_PROPOSAL_FROM_SNAPSHOT = gql`
  mutation unlinkProposalFromSnapshot($proposalId: ID!) {
    unlinkProposalFromSnapshot(proposalId: $proposalId) {
      id
    }
  }
`;

export const CONNECT_DISCORD_ROLE_TO_ORG_ROLE = gql`
  mutation connectDiscordRoleToOrgRole($orgRoleId: ID!, $discordRoleId: String, $guildId: String) {
    connectDiscordRoleToOrgRole(orgRoleId: $orgRoleId, discordRoleId: $discordRoleId, guildId: $guildId) {
      id
      name
      permissions
    }
  }
`;

export const DISCONNECT_DISCORD_ROLE_TO_ORG_ROLE = gql`
  mutation disconnectDiscordRoleToOrgRole($orgRoleId: ID!, $discordRoleId: String) {
    disconnectDiscordRoleToOrgRole(orgRoleId: $orgRoleId, discordRoleId: $discordRoleId) {
      id
      name
      permissions
    }
  }
`;

export const CONNECT_DISCORD_ROLE_TO_POD_ROLE = gql`
  mutation connectDiscordRoleToPodRole($podRoleId: ID!, $discordRoleId: String, $guildId: String) {
    connectDiscordRoleToPodRole(podRoleId: $podRoleId, discordRoleId: $discordRoleId, guildId: $guildId) {
      id
      name
      permissions
    }
  }
`;

export const DISCONNECT_DISCORD_ROLE_TO_POD_ROLE = gql`
  mutation disconnectDiscordRoleToPodRole($podRoleId: ID!, $discordRoleId: String) {
    disconnectDiscordRoleToPodRole(podRoleId: $podRoleId, discordRoleId: $discordRoleId) {
      id
      name
      permissions
    }
  }
`;

export const IMPORT_DISCORD_ROLE_AS_ORG_ROLE = gql`
  mutation importDiscordRoleAsOrgRole($input: ImportDiscordRoleAsRoleInput) {
    importDiscordRoleAsOrgRole(input: $input) {
      success
    }
  }
`;

export const IMPORT_DISCORD_ROLE_AS_POD_ROLE = gql`
  mutation importDiscordRoleAsPodRole($input: ImportDiscordRoleAsRoleInput) {
    importDiscordRoleAsPodRole(input: $input) {
      success
    }
  }
`;

export const IMPORT_NOTION_TASK_TO_ORG = gql`
  mutation importNotionTaskToOrg($orgId: ID!, $notionDatabaseId: String!) {
    importNotionTaskToOrg(orgId: $orgId, notionDatabaseId: $notionDatabaseId) {
      success
    }
  }
`;

export const IMPORT_NOTION_TASK_TO_POD = gql`
  mutation importNotionTaskToPod($podId: ID!, $notionDatabaseId: String!) {
    importNotionTaskToPod(podId: $podId, notionDatabaseId: $notionDatabaseId) {
      success
    }
  }
`;

export const DISCONNECT_NOTION_FROM_ORG = gql`
  mutation disconnectNotionFromOrg($orgId: ID!, $notionWorkspaceId: String!) {
    disconnectNotionFromOrg(orgId: $orgId, notionWorkspaceId: $notionWorkspaceId) {
      success
    }
  }
`;

export const DISCONNECT_NOTION_FROM_POD = gql`
  mutation disconnectNotionFromPod($podId: ID!, $notionWorkspaceId: String!) {
    disconnectNotionFromPod(podId: $podId, notionWorkspaceId: $notionWorkspaceId) {
      success
    }
  }
`;

export const CONNECT_GUILD_TO_ORG = gql`
  mutation connectGuildToOrg($orgId: ID!, $guildId: String!) {
    connectGuildToOrg(orgId: $orgId, guildId: $guildId) {
      success
    }
  }
`;

export const DISCONNECT_GUILD_FROM_ORG = gql`
  mutation disconnectGuildFromOrg($orgId: ID!, $guildId: String!) {
    disconnectGuildFromOrg(orgId: $orgId, guildId: $guildId) {
      success
    }
  }
`;

export const CONNECT_COORDINAPE_TO_ORG = gql`
  mutation connectCoordinapeCircleToOrg($orgId: ID!, $input: CoordinapeConnectInput) {
    connectCoordinapeCircleToOrg(orgId: $orgId, input: $input) {
      success
    }
  }
`;
