import { gql } from '@apollo/client';
import {
  LoggedinUserFragment,
  LoggedinWaitlistUserFragment,
  ProfileUserFragment,
  SmallUserFragment,
} from '../fragments/user';

export const WHOAMI = gql`
  query whoami {
    users {
      ...LoggedinUser
    }
  }
  ${LoggedinUserFragment}
`;

export const GET_LOGGED_IN_USER = gql`
  query {
    getLoggedinUser {
      ...LoggedinUser
    }
  }
  ${LoggedinUserFragment}
`;

export const WHOAMI_WAITLIST = gql`
  query whoamiWaitlist {
    waitlistUsers {
      ...LoggedinWaitlistUser
    }
  }
  ${LoggedinWaitlistUserFragment}
`;

export const GET_LOGGED_IN_WAITLIST_USER = gql`
  query {
    getLoggedinWaitlistUser {
      ...LoggedinWaitlistUser
    }
  }
  ${LoggedinWaitlistUserFragment}
`;

export const GET_USER_SIGNING_MESSAGE = gql`
  mutation getUserSigningMessage($web3Address: String!, $blockchain: String!) {
    getUserSigningMessage(web3Address: $web3Address, blockchain: $blockchain) {
      userExists
      signingMessage
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query getUser($userId: ID!) {
    getUser(userId: $userId) {
      ...UserProfile
    }
  }
  ${ProfileUserFragment}
`;

export const GET_USER_FROM_USERNAME = gql`
  query getUserFromUsername($username: String!) {
    getUserFromUsername(username: $username) {
      ...UserProfile
    }
  }
  ${ProfileUserFragment}
`;

export const GET_USER_PERMISSION_CONTEXT = gql`
  query getUserPermissionContext {
    getUserPermissionContext
  }
`;

export const GET_AUTOCOMPLETE_USERS = gql`
  query GetAutocompleteUsers($username: String!) {
    getAutocompleteUsers(username: $username) {
      id
      firstName
      lastName
      username
      profilePicture
    }
  }
`;

export const GET_USER = gql`
  query getUser($userId: ID!) {
    getUser(userId: $userId) {
      ...UserSmall
    }
  }
  ${SmallUserFragment}
`;

export const GET_USER_INTERESTS = gql`
  query getUserInterests($userId: ID!) {
    getUserInterests(userId: $userId) {
      interests
    }
  }
`;

export const GET_USER_TASKS_COMPLETED_COUNT = gql`
  query getUserTasksCompletedCount($userId: ID!) {
    getUserTasksCompletedCount(userId: $userId)
  }
`;

export const GET_USER_ORG_ROLES = gql`
  query getUserOrgRoles($userId: String, $excludeSharedOrgs: Boolean) {
    getUserOrgRoles(userId: $userId, excludeSharedOrgs: $excludeSharedOrgs) {
      org {
        name
        username
        description
        headerPicture
        profilePicture
        thumbnailPicture
      }
      role {
        name
      }
      joinedAt
    }
  }
`;

export const GET_LOGGED_IN_USER_FULL_ACCESS_ORGS = gql`
  query getLoggedInUserFullAccessOrgs {
    getLoggedInUserFullAccessOrgs {
      id
      name
    }
  }
`;
