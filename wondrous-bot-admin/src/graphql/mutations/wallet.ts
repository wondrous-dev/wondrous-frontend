import { gql } from '@apollo/client';
import {
  LoggedinUserFragment,
  LoggedinWaitlistUserFragment,
} from 'graphql/fragments';
export const CREATE_ORG_WALLET = gql`
  mutation createOrgWallet($input: WalletInput) {
    createOrgWallet(input: $input) {
      id
      createdAt
      orgId
      name
      address
      type
      chain
      deactivatedAt
    }
  }
`;

export const CREATE_POD_WALLET = gql`
  mutation createPodWallet($input: WalletInput) {
    createPodWallet(input: $input) {
      id
      createdAt
      podId
      name
      address
      type
      chain
      deactivatedAt
    }
  }
`;

export const CONNECT_USER_WALLET = gql`
  mutation connectUserWallet(
    $web3Address: String!
    $signedMessage: String!
    $blockchain: String!
    $username: String
    $firstName: String
    $lastName: String
  ) {
    connectUserWallet(
      input: {
        web3Address: $web3Address
        signedMessage: $signedMessage
        blockchain: $blockchain
        username: $username
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      ...LoggedinUser
    }
  }
  ${LoggedinUserFragment}
`;

export const CREATE_WAITLIST_USER = gql`
  mutation createWaitlistUser($phoneNumber: String!, $inviteRefCode: String) {
    createOrGetWaitlistUser(
      phoneNumber: $phoneNumber
      inviteRefCode: $inviteRefCode
    ) {
      token
      waitlistUser {
        ...LoggedinWaitlistUser
      }
    }
  }
  ${LoggedinWaitlistUserFragment}
`;

export const RESEND_VERIFICATION_CODE = gql`
  mutation resendVerificationCode($phoneNumber: String!) {
    resendVerificationCode(phoneNumber: $phoneNumber) {
      success
    }
  }
`;

export const CREATE_USER = gql`
  mutation emailSignup($email: String!, $password: String!, $inviteToken: String) {
    emailSignup(input: { email: $email, password: $password, inviteToken: $inviteToken }) {
      user {
        ...LoggedinUser
      }
      token
    }
  }
  ${LoggedinUserFragment}
`;

export const CREATE_WALLET_USER = gql`
  mutation signupWithWeb3(
    $web3Address: String!
    $signedMessage: String!
    $blockchain: String!
    $username: String
    $firstName: String
    $lastName: String
  ) {
    signupWithWeb3(
      input: {
        web3Address: $web3Address
        signedMessage: $signedMessage
        blockchain: $blockchain
        username: $username
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      user {
        ...LoggedinUser
      }
      token
    }
  }
  ${LoggedinUserFragment}
`;
