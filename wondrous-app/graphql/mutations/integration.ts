import { gql } from '@apollo/client';

export const VERIFY_TWITTER = gql`
  mutation verifyTwitter($code: String) {
    verifyTwitter(code: $code) {
      success
    }
  }
`;


export const VERIFY_USER_TWEET = gql`
  mutation verifyUserTweet {
    verifyUserTweet {
      success
    }
  }
`;
