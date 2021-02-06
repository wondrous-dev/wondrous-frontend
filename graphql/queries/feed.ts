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