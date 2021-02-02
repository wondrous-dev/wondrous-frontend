import { gql } from '@apollo/client'

export const PublicAskFragment = gql`
  fragment PublicAsk on Ask {
    id
    content
    projectId
    status
    project {
      name
    }
    additionalData {
      relatedTaskIds
      relatedGoalIds
      images
      link
    }
  }
`
