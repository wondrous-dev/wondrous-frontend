import { gql } from '@apollo/client'

export const PostFragment = gql`
  fragment PostFragment on Post {
    id
    userId
    projectId
    content
    type
    additionalData {
      link
      images
    }
  }
`