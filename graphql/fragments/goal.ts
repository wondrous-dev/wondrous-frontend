import { gql } from '@apollo/client'

export const PublicGoalFragment = gql`
  fragment PublicGoal on Goal {
    id
    name
    detail
    priority
    dueDate
    privacyLevel
    createdBy
    ownerId
    projectId
    projectName
    additionalData {
      images
      link
    }
  }
`
