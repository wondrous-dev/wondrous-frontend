import { gql } from '@apollo/client';
import { PostFragment } from '../fragments/post';

export const CREATE_POST = gql`
  mutation createPost($input: PostInput!) {
    createPost(input: $input) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;

export const UPDATE_POST = gql`
  mutation updatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;
