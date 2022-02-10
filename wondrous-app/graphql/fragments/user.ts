import { gql } from '@apollo/client';

export const LoggedinUserFragment = gql`
  fragment LoggedinUser on User {
    id
    username
    bio
    activeEthAddress
    profilePicture
    headerPicture
    thumbnailPicture
    userInfo {
      email
    }
  }
`;

export const LoggedinWaitlistUserFragment = gql`
  fragment LoggedinWaitlistUser on WaitlistUser {
    id
    email
    phoneNumber
    invitesSent
    refCode
    tokensEarned
    phoneVerified
  }
`;

export const ProfileUserFragment = gql`
  fragment UserProfile on User {
    id
    username
    bio
    firstName
    lastName
    headerPicture
    activeEthAddress
    profilePicture
    thumbnailPicture
    links {
      url
      displayName
      type
    }
    additionalInfo {
      orgCount
      podCount
    }
  }
`;
