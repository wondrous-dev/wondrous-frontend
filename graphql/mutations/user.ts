import { gql } from '@apollo/client'

import { PublicUserFragment } from '../fragments/user'

export const SIGNUP = gql`
  mutation Signup($input: AuthInput!) {
    signup(input: $input) {
      token
      user {
        ...PublicUser
      }
    }
  }
  ${PublicUserFragment}
`
export const UPDATE_USER = gql`
  mutation UpdateUser($input: UserUpdateInput!) {
    updateUser(input: $input) {
      ...PublicUser
    }
  }
  ${PublicUserFragment}
`

export const FOLLOW_USER = gql`
  mutation FollowUser($followingId: ID!) {
    followUser(followingId: $followingId) {
      success
    }
  }
`

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followingId: ID!) {
    unfollowUser(followingId: $followingId) {
      success
    }
  }
`