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
