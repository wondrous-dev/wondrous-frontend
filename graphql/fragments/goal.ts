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
    status
    project {
      name
    }
    additionalData {
      images
      link
    }
    relatedAskIds
    completedAt
    muxPlaybackId
  }
`

export const AdditionalGoalFragment = gql`
  fragment AdditionalGoal on Goal {
    ...PublicGoal
    taskCount
  }
  ${PublicGoalFragment}
`