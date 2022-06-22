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
      id
      name
      color
      permissions
    }
  }
`;

export const GET_ORG_ROLES_CLAIMABLE_BY_DISCORD = gql`
  query getOrgRolesClaimableByDiscord($orgId: ID!) {
    getOrgRolesClaimableByDiscord(orgId: $orgId) {
      id
      name
      permissions
    }
  }
`;
