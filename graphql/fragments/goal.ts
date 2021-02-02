import { gql } from '@apollo/client'

// PS made an additional fragment
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
    project {
      name
    }
    additionalData {
      images
      link
      relatedAskIds
    }
  }
`

export const AdditionalGoalFragment = gql`
  fragment AdditionalGoal on Goal {
    ...PublicGoal
    additionalInfo {
      taskCount
    }
  }
  ${PublicGoalFragment}
`