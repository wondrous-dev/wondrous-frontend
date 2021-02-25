import { gql } from '@apollo/client'

import { PublicUserFragment, LoggedinUserFragment } from '../fragments/user'

export const SIGNUP = gql`
  mutation Signup($input: AuthInput!) {
    signup(input: $input) {
      token
      user {
        ...LoggedinUser
      }
    }
  }
  ${LoggedinUserFragment}
`
export const EMAIL_SIGNUP = gql`
  mutation emailSignup($input: AuthInput!) {
    emailSignup(input: $input) {
      token
      user {
        ...LoggedinUser
      }
    }
  }
  ${LoggedinUserFragment}
`
export const EMAIL_SIGNIN = gql`
  mutation emailSignin($input: AuthInput!) {
    emailSignin(input: $input) {
      token
      user {
        ...LoggedinUser
      }
    }
  }
  ${LoggedinUserFragment}
`
export const UPDATE_USER = gql`
  mutation UpdateUser($input: UserUpdateInput!) {
    updateUser(input: $input) {
      ...LoggedinUser
    }
  }
  ${LoggedinUserFragment}
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