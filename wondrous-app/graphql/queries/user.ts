import { gql } from '@apollo/client';
import { LoggedinUserFragment, LoggedinWaitlistUserFragment, ProfileUserFragment } from '../fragments/user';

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

export const GET_USER_PROFLIE = gql`
  query getUser($userId: String!) {
    getUser(userId: $userId) {
      ...UserProfile
    }
  }
  ${ProfileUserFragment}
`;

export const GET_USER_ABOUT_PAGE_DATA = gql`
  query getUserAboutPageData($userId: ID!) {
    getUserAboutPageData(userId: $userId) {
      orgs {
        name
        description
        profilePicture
        thumbnailPicture
      }
      pods {
        name
        description
        profilePicture
        thumbnailPicture
        org {
          id
          profilePicture
          thumbnailPicture
        }
      }
      tasksCompletedCount
      tasksCompleted {
        title
        description
        status
        orgProfilePicture
        podProfilePicture
        assigneeProfilePicture
      }
    }
  }
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
      ...UserProfile
    }
  }
  ${ProfileUserFragment}
`;
