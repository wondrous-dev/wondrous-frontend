import { gql } from '@apollo/client'

export const PublicAskFragment = gql`
  fragment PublicAsk on Ask {
    id
    content
    projectId
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
