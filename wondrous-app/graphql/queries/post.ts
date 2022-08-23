import { gql } from '@apollo/client';
import { PostFragment } from 'graphql/fragments/post';

export const GET_USER_KUDOS = gql`
  query getUserKudos($limit: Int, $offset: Int) {
    getUserKudos(limit: $limit, offset: $offset) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;
