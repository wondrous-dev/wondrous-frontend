import { gql } from '@apollo/client'

import { ActivityFeedItem } from '../fragments/feed'

export const CREATE_FEED_COMMENT = gql`
  mutation CreateFeedComment($feedItemId: String!, $content: String!, $userMentions: [ID], $projectMentions: [String], $previousCommenterIds: [ID] ) {
    createFeedComment(feedItemId: $feedItemId, content: $content, userMentions: $userMentions, projectMentions: $projectMentions, previousCommenterIds: $previousCommenterIds) {
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

export const PIN_USER_FEED_ITEM = gql`
  mutation PinUserFeedItem($feedItemId: String!, $userId: String) {
    createUserPinnedFeed(feedItemId: $feedItemId, userId: $userId) {
      success
    }
  }
`

export const PIN_PROJECT_FEED_ITEM = gql`
  mutation PinProjectFeedItem($feedItemId: String!, $projectId: String) {
    createProjectPinnedFeed(feedItemId: $feedItemId, projectId: $projectId) {
      success
    }
  }
`

export const UNPIN_FEED_ITEM = gql`
  mutation UnpinFeedItem($userId: String, $projectId: String) {
    deletePinnedFeed(userId: $userId, projectId: $projectId) {
      success
    }
  }
`