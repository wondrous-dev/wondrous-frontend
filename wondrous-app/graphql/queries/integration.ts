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
