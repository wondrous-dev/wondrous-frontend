import { gql } from '@apollo/client'

import { ActivityFeedItem } from '../fragments/feed'

export const CREATE_FEED_COMMENT = gql`
  mutation CreateFeedComment($feedItemId: String!, $content: String!, $userMentions: [ID]) {
    createFeedComment(feedItemId: $feedItemId, content: $content, userMentions: $userMentions) {
      ...ActivityFeedItem
    }
  }

  ${ActivityFeedItem}
`

export const DELETE_FEED_COMMENT = gql`
  mutation DeleteFeedComment($feedCommentId: String!) {
    deleteFeedComment(feedCommentId: $feedCommentId) {
      success
    }
  }
`
export const REACT_FEED_ITEM = gql`
  mutation ReactFeedItem($feedItemId: String!) {
    reactFeedItem(feedItemId: $feedItemId) {
      success
    } 
  }
`
export const REACT_FEED_COMMENT = gql`
  mutation ReactFeedComment($feedCommentId: String!) {
    reactFeedComment(feedCommentId: $feedCommentId) {
      success
    } 
  }
`
