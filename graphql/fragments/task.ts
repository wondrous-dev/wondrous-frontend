import { gql } from '@apollo/client'

export const PublicTaskFragment = gql`
  fragment PublicTask on Task {
    id
    name
    detail
    priority
    dueDate
    privacyLevel
    createdBy
    ownerId
    projectId
    goalId
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
