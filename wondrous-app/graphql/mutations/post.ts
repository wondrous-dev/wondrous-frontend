import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation createPost($input: PostInput!) {
    createPost(input: $input) {
      id
    }
  }
`;

export const UPDATE_POST = gql`
  mutation updatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      id
    }
  }
`;
