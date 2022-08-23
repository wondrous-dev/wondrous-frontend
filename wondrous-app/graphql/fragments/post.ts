import { gql } from '@apollo/client';
import { MediaFragment } from './media';

export const PostFragment = gql`
  fragment PostFragment on Post {
    id
    userId
    projectId
    content
    type
    additionalData {
      userMentions
    }
    creator {
      username
      profilePicture
    }
    createdBy
    media {
      ...MediaFragment
    }
  }
  ${MediaFragment}
`;
