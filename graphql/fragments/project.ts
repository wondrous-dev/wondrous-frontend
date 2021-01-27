import { gql } from '@apollo/client'

export const PublicProjectFragment = gql`
  fragment PublicProject on Project {
    id
    name
    description
    category
    archivedAt
    privacyLevel
    profilePicture
    createdBy
    tags
    category
    collaborators {
      role
      user {
        id
      }
    }
    links {
      website
      linkedin
      github
      twitter
      instagram
    }
    createdAt
    followCount
    goalsCompletedCount
    tasksCompletedCount
  }
`
