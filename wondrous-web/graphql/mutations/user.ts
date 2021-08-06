import { gql } from '@apollo/client'
import { LoggedinUserFragment } from '../fragments/user'

export const REQUEST_SPOTIFY_AUTHORIZATION = gql`
  mutation RequestSpotifyAuthorization($code: String!) {
    requestSpotifyAuthorization(code: $code) {
      token
      user {
        ...LoggedinUser
      }
    }
  }
  ${LoggedinUserFragment}
`
