import { gql } from '@apollo/client'

import { PublicProjectFragment } from '../fragments/project'
import { AdditionalGoalFragment } from '../fragments/goal'
import { PublicTaskFragment } from '../fragments/task'
import { ActivityFeedItem } from '../fragments/feed'

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($projectId: ID!) {
    getProjectById(projectId: $projectId) {
      ...PublicProject
    }
  }
  ${PublicProjectFragment}
`

export const GET_PROJECT_FEED = gql`
  query GetProjectFeed($projectId: ID!) {
    getProjectFeed(projectId: $projectId) {
      ...ActivityFeedItem
    }
  }
  ${ActivityFeedItem}
`

export const GET_USER_PROJECTS = gql`
  query GetProjectsByUser {
    getUserProjects {
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

export const GET_PROJECT_ACTIONS = gql`
  query GetProjectActions($projectId: ID!, $status: String) {
    getProjectActions(projectId: $projectId, status: $status) {
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