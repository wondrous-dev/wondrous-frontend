import { gql } from '@apollo/client'

import { PublicUserFragment } from '../fragments/user'
import { AdditionalGoalFragment } from '../fragments/goal'
import { PublicTaskFragment } from '../fragments/task'
import { ActivityFeedItem } from '../fragments/feed'

export const WHOAMI = gql`
  query whoami {
    users {
      ...PublicUser
    }
  }
  ${PublicUserFragment}
`

export const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      ...PublicUser
    }
  }
  ${PublicUserFragment}
`

export const GET_USER_ADDITIONAL_INFO = gql`
  query GetUserAdditionalInfo($userId: ID!) {
    getUserAdditionalInfo(userId: $userId) {
      followerCount
      followingCount
      projectCount
    }
  }
`

export const GET_AUTOCOMPLETE_USERS = gql`
  query GetAutocompleteUsers($username: String!) {
    getAutocompleteUsers(username: $username) {
      ...PublicUser
    }
  }
  ${PublicUserFragment}
`

export const GET_HOME_FEED = gql`
  query GetHomeFeed($limit: Int, $offset: Int) {
    getHomeFeed(limit: $limit, offset: $offset) {
      ...ActivityFeedItem
    }
  }
  ${ActivityFeedItem}
`

export const GET_USER_FOLLOWERS = gql`
  query GetUserFollowers($userId: ID!) {
    getUserFollowers(userId: $userId) {
      ...PublicUser
    }
  }
  ${PublicUserFragment}
`

export const GET_USER_FOLLOWING = gql`
  query GetUserFollowing($userId: ID!) {
    getUserFollowing(userId: $userId) {
      ...PublicUser
    }
  }
  ${PublicUserFragment}
`

export const GET_USER_FEED = gql`
  query GetUserFeed($userId: ID!, $offset: Int, $limit: Int) {
    getUserFeed(userId: $userId, offset: $offset, limit: $limit) {
      ...ActivityFeedItem
    }
  }
  ${ActivityFeedItem}
`

export const GET_USER_ACTIONS = gql`
  query GetUserActions($userId: ID!, $status: String) {
    getUserActions(userId: $userId, status: $status) {
      goals {
        ...AdditionalGoal
      }
      tasks {
        ...PublicTask
      }
    }
  }
  ${AdditionalGoalFragment}
  ${PublicTaskFragment}
`
