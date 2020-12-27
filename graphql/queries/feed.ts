import { gql } from '@apollo/client'

import { ActivityFeedItem } from '../fragments/feed'

export const GET_FEED_COMMENTS = gql`
  query GetFeedItemComments($feedItemId: String!) {
    getFeedItemComments(feedItemId: $feedItemId) {
      ...ActivityFeedItem
    }
  }

  ${ActivityFeedItem}
`
