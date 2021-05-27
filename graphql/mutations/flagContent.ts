import { gql } from '@apollo/client'

export const FLAG_CONTENT = gql`
  mutation FlagContent(objectType: String, objectId: String, projectId) {
    success
  }
`