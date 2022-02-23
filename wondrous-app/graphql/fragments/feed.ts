import { gql } from '@apollo/client';
import { MediaFragment } from './media';

export const FeedAdditionaldata = gql`
  fragment FeedAdditionaldata on FeedAdditionaldata {
    reviewScore
    weekStartDate
  }
`;

export const FeedItemFragment = gql`
  fragment FeedItemFragment on FeedItem {
    id
    timestamp
    userId
    verb
    objectType
    objectId
    projectId
    projectName
    privacyLevel
    actorFirstName
    actorLastName
    actorUsername
    actorProfilePicture
    actorThumbnail
    parentCommentId
    itemName
    itemContent
    commentCount
    reactionCount
    commentReacted
    type
    media {
      ...MediaFragment
    }
    completedMessage
    pinned
    additionalData {
      ...FeedAdditionaldata
    }
  }
  ${MediaFragment}
  ${FeedAdditionaldata}
`;
