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
    userId
    additionalData {
      relatedTaskIds
      relatedGoalIds
      images
      link
    }
    muxPlaybackId
  }
`
