import { gql } from '@apollo/client';

export const GET_TWITTER_CHALLENGE_CODE = gql`
  query getTwitterCallengeCode {
    getTwitterCallengeCode {
      challengeCode
    }
  }
`;
