import { gql } from '@apollo/client'

import { PublicUserFragment } from '../fragments/user'
import { ActivityFeedItem } from '../fragments/feed'

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

export const GET_HOME_FEED = gql`
  query GetHomeFeed($limit: Int, $offset: Int) {
    getHomeFeed(limit: $limit, offset: $offset) {
      ...ActivityFeedItem
    }
  }
  ${ActivityFeedItem}
`
