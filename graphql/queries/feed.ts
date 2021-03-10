import { gql } from '@apollo/client'

import { ActivityFeedItem, ActivityFeedComment } from '../fragments/feed'
import { UserListFragment } from '../fragments/user'

export const GET_FEED_COMMENTS = gql`
  query GetFeedItemComments($feedItemId: String!) {
    getFeedItemComments(feedItemId: $feedItemId) {
      ...ActivityFeedComment
    }
  }

  ${ActivityFeedComment}
`

export const GET_GOAL_FEED = gql`
  query GetGoalFeed($goalId: ID!) {
    getGoalFeed(goalId: $goalId) {
      ...ActivityFeedItem
    }
  }
  ${ActivityFeedItem}
`

export const GET_TASK_FEED = gql`
  query getTaskFeed($taskId: ID!) {
    getTaskFeed(taskId: $taskId) {
      ...ActivityFeedItem
    }
  }
  ${ActivityFeedItem}
`

export const GET_ASK_FEED = gql`
  query getAskFeed($askId: ID!) {
    getAskFeed(askId: $askId) {
      ...ActivityFeedItem
    } 
  }
  ${ActivityFeedItem}
`

export const GET_FEED_ITEM_FOR_FEED_COMMENT = gql`
  query GetFeedItemForFeedComment($commentId: ID!) {
    getFeedItemForFeedComment(commentId: $commentId) {
      ...ActivityFeedItem
    }
  }
  ${ActivityFeedItem}
`

export const GET_FEED_REACTED_USERS = gql`
  query GetFeedReactedUsers($feedItemId: ID!) {
    getFeedReactedUsers(feedItemId: $feedItemId) {
      ...UserList
    }
  }
  ${UserListFragment}
`

export const GET_FEED_COMMENT_REACTED_USERS = gql`
  query GetFeedCommentReactedUsers($feedCommentId: ID!) {
    getFeedCommentReactedUsers(feedCommentId: $feedCommentId) {
      ...UserList
    }
  }
  ${UserListFragment}
`

export const GET_FEED_ITEM = gql`
  query GetFeedItem($feedItemId: ID!) {
    getFeedItem(feedItemId: $feedItemId) {
      ...ActivityFeedItem
    } 
  }
  ${ActivityFeedItem}
`

export const GET_POST_ITEM = gql`
  query GetPostItem($postId: ID!) {
    getPostItem(postId: $postId) {
      ...ActivityFeedItem
    }
  }
  ${ActivityFeedItem}
`