import { gql } from '@apollo/client';
import {
  LoggedinUserFragment,
  LoggedinWaitlistUserFragment,
  SmallUserFragment,
} from 'graphql/fragments';

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



export const GET_LOGGED_IN_USER_FULL_ACCESS_ORGS = gql`
  query getLoggedInUserFullAccessOrgs($cmtyEnabled: Boolean, $excludeSharedOrgs:Boolean ) {
    getLoggedInUserFullAccessOrgs(cmtyEnabled: $cmtyEnabled, excludeSharedOrgs: $excludeSharedOrgs) {
      id
      username
      name
      profilePicture
      thumbnailPicture
      privacyLevel
      shared
      cmtyEnabled
    }
  }
`;
