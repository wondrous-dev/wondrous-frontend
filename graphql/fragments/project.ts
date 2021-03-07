import { gql } from '@apollo/client'
import { PublicUserFragment } from './user'

export const PublicProjectFragment = gql`
  fragment PublicProject on Project {
    id
    name
    description
    category
    archivedAt
    privacyLevel
    profilePicture
    thumbnailPicture
    createdBy
    tags
    category
    collaborators {
      role
      user {
        ...PublicUser
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
  ${PublicUserFragment}
`
