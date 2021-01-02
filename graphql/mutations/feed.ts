import { gql } from '@apollo/client'

import { ActivityFeedItem } from '../fragments/feed'

export const CREATE_FEED_COMMENT = gql`
  mutation CreateFeedComment($feedItemId: String!, $content: String!) {
    createFeedComment(feedItemId: $feedItemId, content: $content) {
      ...ActivityFeedItem
    }
  }

  ${ActivityFeedItem}
`

