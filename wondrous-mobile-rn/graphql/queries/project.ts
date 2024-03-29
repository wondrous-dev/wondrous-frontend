import { gql } from '@apollo/client'

import { PublicProjectFragment, ProjectWithTagsFragment } from '../fragments/project'
import { AdditionalGoalFragment } from '../fragments/goal'
import { PublicTaskFragment } from '../fragments/task'
import { ActivityFeedItem } from '../fragments/feed'
import { PublicUserFragment } from '../fragments/user'

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($projectId: ID!) {
    getProjectById(projectId: $projectId) {
      ...PublicProject
    }
  }
  ${PublicProjectFragment}
`

export const GET_PROJECT_FEED = gql`
  query GetProjectFeed($projectId: ID!, $offset: Int, $limit: Int) {
    getProjectFeed(projectId: $projectId, offset: $offset, limit: $limit) {
      ...ActivityFeedItem
    }
  }
  ${ActivityFeedItem}
`

export const GET_NEWEST_PROJECTS = gql`
  query GetNewestProjects($limit: Int, $offset: Int) {
    getNewestProjects(limit: $limit, offset: $offset) {
      ...ProjectWithTags
    }
  }
  ${ProjectWithTagsFragment}
`

export const GET_USER_PROJECTS = gql`
  query GetProjectsByUser($userId: ID) {
    getUserProjects(userId: $userId) {
      project {
        id
        name
        description
        profilePicture
      }
      role
    }
  }
`

export const GET_PROJECTS_AUTOCOMPLETE = gql`
  query GetAutocompleteProjects($name: String) {
    getAutocompleteProjects(name: $name) {
      id
      name
      profilePicture
    }
  }
`

export const GET_PROJECT_ACTIONS = gql`
  query GetProjectActions($projectId: ID!, $status: String, $limit: Int, $offset: Int) {
    getProjectActions(projectId: $projectId, status: $status, limit: $limit, offset: $offset) {
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

export const GET_PROJECT_FOLLOW_REQUESTS = gql`
  query GetProjectFollowRequests($projectId: ID!) {
    getProjectFollowRequests(projectId: $projectId) {
      ...PublicUser
    }
  }
  ${PublicUserFragment}
`

export const GET_PROJECT_FOLLOW_REQUEST = gql`
  query GetProjectFollowRequest($projectId: ID!, $userId: ID!) {
    getProjectFollowRequest(projectId: $projectId, userId: $userId) {
      id
      approvedAt
    }
  }
`
export const GET_PROJECT_FOLLOWERS = gql`
  query GetProjectFollowers($projectId: ID!) {
    getProjectFollowers(projectId: $projectId) {
      ...PublicUser
    }
  }
  ${PublicUserFragment}
`

export const GET_PROJECT_INVITES = gql`
  query GetProjectInvites($projectId: ID) {
    getProjectInvitesForProject(projectId: $projectId) {
      id
      role
      inviteeId
      invitorId
      response
    }
  }
`

export const GET_PROJECT_INVITE_FROM_NOTIFICATION = gql`
  query GetProjectInviteFromNotification($projectId: ID, $invitorId: ID, $inviteeId: ID) {
    getProjectInviteFromNotification(projectId: $projectId, invitorId: $invitorId, inviteeId: $inviteeId) {
      id
      project {
        id
        name
      }
      invitor {
        id
        username
      }
      invitee {
        id
        username
      }
      role
      response
    }
  }
`