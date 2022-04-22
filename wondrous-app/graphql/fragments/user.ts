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
      discordUsername
    }
    signupCompleted
    links {
      url
      displayName
      type
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
