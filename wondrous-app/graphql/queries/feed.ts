import { gql } from '@apollo/client';
import { FeedItemFragment } from '../fragments/feed';

export const GET_ORG_FEED = gql`
  query getOrgFeed($limit: Int, $offset: Int, $orgId: ID!) {
    getOrgFeed(orgId: $orgId, limit: $limit, offset: $offset) {
      ...FeedItemFragment
    }
  }
  ${FeedItemFragment}
`;

export const GET_POD_FEED = gql`
  query getPodFeed($limit: Int, $offset: Int, $podId: ID!) {
    getPodFeed(podId: $podId, limit: $limit, offset: $offset) {
      ...FeedItemFragment
    }
  }
  ${FeedItemFragment}
`;

export const GET_USER_FEED = gql`
  query getUserFeed($limit: Int, $offset: Int, $userId: ID, $verb: String) {
    getUserFeed(userId: $userId, verb: $verb, limit: $limit, offset: $offset) {
      ...FeedItemFragment
    }
  }
  ${FeedItemFragment}
`;
