import { gql } from '@apollo/client';
import { LoggedinUserFragment, ProfileUserFragment } from '../fragments/user';

export const LOGIN_MUTATION = gql`
  mutation emailSignin($email: String!, $password: String!) {
    emailSignin(input: { email: $email, password: $password }) {
      user {
        ...LoggedinUser
      }
      token
    }
  }
  ${LoggedinUserFragment}
`;
export const LOGIN_WALLET_MUTATION = gql`
  mutation signinWithWeb3($web3Address: String!, $signedMessage: String!) {
    signinWithWeb3(input: { web3Address: $web3Address, signedMessage: $signedMessage }) {
      user {
        ...LoggedinUser
      }
      token
    }
  }
  ${LoggedinUserFragment}
`;

export const REDEEM_ORG_INVITE_LINK = gql`
  mutation redeemOrgInviteLink($token: String!) {
    redeemOrgInviteLink(token: $token) {
      success
    }
  }
`;

export const REDEEM_POD_INVITE_LINK = gql`
  mutation redeemPodInviteLink($token: String!) {
    redeemPodInviteLink(token: $token) {
      success
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($input: UserUpdateInput!) {
    updateUser(input: $input) {
      ...UserProfile
    }
  }
  ${ProfileUserFragment}
`;

export const CONFIRM_EMAIL_ADDRESS = gql`
  mutation confirmEmailAddress($userId: ID, $token: String!) {
    confirmEmailAddress(userId: $userId, token: $token) {
      success
    }
  }
`;

export const CONNECT_USER_DISCORD = gql`
  mutation connectUserDiscord($discordAuthCode: String!) {
    connectUserDiscord(discordAuthCode: $discordAuthCode) {
      success
    }
  }
`;

export const SET_USER_SIGNUP_COMPLETE = gql`
  mutation {
    setUserSignupComplete {
      ...LoggedinUser
    }
  }
  ${LoggedinUserFragment}
`;

export const USER_DISOCRD_SIGNUP_LOGIN = gql`
  mutation discordSignupLogin($discordAuthCode: String!) {
    discordSignupLogin(discordAuthCode: $discordAuthCode) {
      user {
        ...LoggedinUser
      }
      token
    }
  }
  ${LoggedinUserFragment}
`;
