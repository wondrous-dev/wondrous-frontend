import { gql } from '@apollo/client'

import { PublicProjectFragment } from '../fragments/project'
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
      }
      role
    }
  }
`
