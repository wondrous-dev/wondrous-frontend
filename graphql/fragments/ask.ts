import { gql } from '@apollo/client'

export const PublicAskFragment = gql`
  fragment PublicAsk on Ask {
    id
    content
    projectId
    projectName
    additionalData {
      relatedTaskIds
      relatedGoalIds
    }
  }
`
