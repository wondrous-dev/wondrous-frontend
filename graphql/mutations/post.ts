import { gql } from '@apollo/client'

import { PostFragment } from '../fragments/post'

export const CREATE_POST = gql`
  mutation CreatePost($input: PostInput) {
    createPost(input: $input) {
      ...PostFragment
    }
  }
  ${PostFragment}
`
