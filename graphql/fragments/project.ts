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
    collaborators
    createdAt
    followCount
    goalsCompleted
    tasksCompleted
  }
`
