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
