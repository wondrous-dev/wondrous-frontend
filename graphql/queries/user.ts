import { gql } from '@apollo/client'

import { PublicUserFragment } from '../fragments/user'

export const WHOAMI = gql`
  query whoami {
    users {
      ...PublicUser
    }
  }
  ${PublicUserFragment}
`

export const GET_AUTOCOMPLETE_USERS = gql`
  query GetAutocompleteUsers($username: String!) {
    getAutocompleteUsers(username: $username) {
      ...PublicUser
    }
  }
  ${PublicUserFragment}
`