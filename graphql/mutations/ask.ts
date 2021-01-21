import { gql } from '@apollo/client'

import { PublicAskFragment } from '../fragments/ask'

export const CREATE_ASK = gql`
  mutation CreateAsk($input: AskInput) {
    createAsk(input: $input) {
      ...PublicAsk
    }
  }
  ${PublicAskFragment}
`

export const UPDATE_ASK = gql`
  mutation UpdateTask($askId: ID!, $input: AskInput) {
    updateAsk(AskId: $askId, input: $input) {
      ...PublicAsk
    }
  }
  ${PublicAskFragment}
`

export const DELETE_ASK = gql`
  mutation DeleteAsk($askId: ID!) {
    success
  }
`
