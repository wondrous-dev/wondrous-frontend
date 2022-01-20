import { gql } from '@apollo/client'
import { PodFragment } from '../fragments/pod'

export const GET_POD_BY_ID = gql`
  query getPodById($podId: ID!) {
    getPodById(podId: $podId) {
      ...PodFragment
    }
  }
  ${PodFragment}
`

export const GET_USER_PODS = gql`
  query getUserPods($userId: String) {
    getUserPods(userId: $userId) {
      id
      username
      name
      profilePicture
    }
  }
`

export const GET_USER_AVAILABLE_PODS = gql`
  query getAvailableUserPods($orgId: String) {
    getAvailableUserPods(orgId: $orgId) {
      id
      username
      name
      profilePicture
    }
  }
`

export const GET_POD_USERS = gql`
  query getPodUsers($podId: String!) {
    getPodUsers(orgId: $orgId) {
      user {
        id
        username
        profilePicture
        bio
      }
      role {
        permissions
      }
    }
  }
`
