import { gql } from '@apollo/client'

import { PublicUserFragment, LoggedinUserFragment, LoggedinUserWithTokenFragment, UserListFragment, UserSignupRecommendationFragment } from '../fragments/user'
import { AdditionalGoalFragment, PublicGoalFragment } from '../fragments/goal'
import { PublicTaskFragment } from '../fragments/task'
import { ActivityFeedItem } from '../fragments/feed'
import { PublicProjectFragment } from '../fragments/project'

export const WHOAMI = gql`
  query whoami {
    users {
      ...LoggedinUser
    }
  }
  ${LoggedinUserFragment}
`

export const GET_LOGGED_IN_USER = gql`
  query {
    getLoggedinUser {
      ...LoggedinUserWithToken
    }
  }
  ${LoggedinUserWithTokenFragment}
`
export const GET_USER_STREAK = gql`
  query GetUserStreak($userId: ID) {
    getUserStreak(userId: $userId) {
      currentStreak
      lastActivityAt
      lastActiveTimezone
    }
  }
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
  query GetUserAdditionalInfo($userId: ID) {
    getUserAdditionalInfo(userId: $userId) {
      followerCount
      followingCount
      projectCount
    }
  }
`
export const CHECK_USER_FOLLOWS_BACK = gql`
  query CheckUserFollowsBack($userId: ID!) {
    doesUserFollowBack(userId: $userId)
  }
`
export const GET_AUTOCOMPLETE_USERS = gql`
  query GetAutocompleteUsers($username: String!) {
    getAutocompleteUsers(username: $username) {
      id
      firstName
      lastName
      username
      profilePicture
    }
  }
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
  query GetUserFollowers($userId: ID) {
    getUserFollowers(userId: $userId) {
      ...PublicUser
    }
  }
  ${PublicUserFragment}
`

export const GET_USER_FOLLOWING = gql`
  query GetUserFollowing($userId: ID) {
    getUserFollowing(userId: $userId) {
      users {
        ...PublicUser
      }
      projects {
        ...PublicProject
      }
    }
  }
  ${PublicUserFragment}
  ${PublicProjectFragment}
`

export const GET_USER_FEED = gql`
  query GetUserFeed($userId: ID, $offset: Int, $limit: Int) {
    getUserFeed(userId: $userId, offset: $offset, limit: $limit) {
      ...ActivityFeedItem
    }
  }
  ${ActivityFeedItem}
`

export const GET_USER_ACTIONS = gql`
  query GetUserActions($userId: ID, $status: String, $limit: Int, $offset: Int) {
    getUserActions(userId: $userId, status: $status, limit: $limit, offset: $offset) {
      goals {
        ...AdditionalGoal
        taskCount
        completedTaskCount
      }
      tasks {
        ...PublicTask
      }
    }
  }
  ${AdditionalGoalFragment}
  ${PublicTaskFragment}
`

export const GET_USER_RING_ACTION_COUNT = gql`
  query GetUserRingActionCount($userId: ID!) {
    getUserRingData(userId: $userId) {
      incompleteGoalCount
      completedGoalCount
      incompleteTaskCount
      completedTaskCount
    }
  }
`

export const GET_USER_RING_GOALS = gql`
  query GetUserRingGoals($userId: ID!) {
    getUserRingGoals(userId: $userId) {
      incompleteGoals {
        ...PublicGoal
      }
      completedGoals {
        ...PublicGoal
      }
    }
  }
  ${PublicGoalFragment}
`

export const GET_USER_RING_TASKS = gql`
  query GetUserRingTasks($userId: ID!) {
    getUserRingTasks(userId: $userId) {
      incompleteTasks {
        ...PublicTask
      }
      completedTasks {
        ...PublicTask
      }
    }
  }
  ${PublicTaskFragment}
`

export const GET_USER_INTERESTS = gql`
  query GetUserInterests($userId: ID) {
    getUserInterests(userId: $userId) {
      interests
    }
  }
`

export const GET_RECOMMENDED_USERS_TO_FOLLOW = gql`
  query getRecommendedUsersToFollowOnSignup($groupId: ID, $limit: Int) {
    getRecommendedUsersToFollowOnSignup(groupId: $groupId, limit: $limit) {
      ...PublicUserSignupRecommendation
    }
  }
  ${UserSignupRecommendationFragment}
`