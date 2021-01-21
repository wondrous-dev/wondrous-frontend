import { gql } from '@apollo/client'

import { PublicAskFragment } from '../fragments/ask'

export const GET_ASKS_FROM_PROJECT = gql`
  query GetAsksFromProject($projectId: ID!) {
    getAsksFromProject(projectId: $projectId) {
      ...PublicAsk
    }
  }
  ${PublicAskFragment}
`

export const GET_ASKS_FROM_USER = gql`
  query GetAsksFromUser {
    getAsksFromUser {
      ...PublicAsk
    }
  }
  ${PublicAskFragment}
`
