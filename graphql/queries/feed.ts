import { gql } from '@apollo/client'

import { ActivityFeedItem, ActivityFeedComment } from '../fragments/feed'

export const GET_FEED_COMMENTS = gql`
  query GetFeedItemComments($feedItemId: String!) {
    getFeedItemComments(feedItemId: $feedItemId) {
      ...ActivityFeedComment
    }
  }

  ${ActivityFeedComment}
`

export const GET_FEED_REACTION_OBJ = gql`
  query getFeedReactionObj($feedObjectId: ID!, $feedObjectType: String!) {
    getFeedReactionObject(feedObjectId: $feedObjectId, feedObjectType: $feedObjectType) {
      ...ActivityFeedItem
    }
  }
  ${ActivityFeedItem}
`