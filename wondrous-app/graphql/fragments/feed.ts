import { gql } from '@apollo/client';
import { MediaFragment } from './media';

export const LinkFragment = gql`
  fragment LinkFragment on Link {
    url
    displayName
    type
  }
`;

export const ActorFragment = gql`
  fragment ActorFragment on Actor {
    id
    username
    profilePicture
    thumbnail
  }
`;

export const ReferenceObjectFragment = gql`
  fragment ReferenceObjectFragment on ReferencedObject {
    objectId
    objectType
    actor {
      ...ActorFragment
    }
    title
    content
    media {
      ...MediaFragment
    }
    links {
      ...LinkFragment
    }
    taskStatus
  }
  ${MediaFragment}
  ${LinkFragment}
  ${ActorFragment}
`;

export const FeedItemFragment = gql`
  fragment FeedItemFragment on FeedItem {
    feedId
    timestamp
    verb
    postId
    postType
    actor {
      ...ActorFragment
    }
    content
    links {
      ...LinkFragment
    }
    media {
      ...MediaFragment
    }
    commentCount
    reactionCount
    referencedObject {
      ...ReferenceObjectFragment
    }
  }
  ${MediaFragment}
  ${ActorFragment}
  ${ReferenceObjectFragment}
`;
