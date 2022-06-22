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
  mutation connectDiscordRoleToOrgRole($orgRoleId: ID!, $discordRoleId: String) {
    connectDiscordRoleToOrgRole(orgRoleId: $orgRoleId, discordRoleId: $discordRoleId) {
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



export const CLAIM_ORG_ROLE_BY_DISCORD_ROLE = gql`
  mutation claimOrgRoleByDiscordRole($orgRoleId: ID!) {
    claimOrgRoleByDiscordRole(orgRoleId: $orgRoleId) {
      success
    }
  }
`;

export const IMPORT_DISCORD_ROLE_AS_ORG_ROLE = gql`
  mutation importDiscordRoleAsOrgRole($orgId: ID!, $discordRoleIds: [String]) {
    importDiscordRoleAsOrgRole(orgId: $orgId, discordRoleIds: $discordRoleIds) {
      success
    }
  }
`;
