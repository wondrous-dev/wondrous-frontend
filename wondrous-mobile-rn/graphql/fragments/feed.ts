import { gql } from '@apollo/client'

export const ActivityFeedItem = gql`
  fragment ActivityFeedItem on FeedItem {
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
    completedMessage
    pinned
    additionalData {
      reviewScore
      weekStartDate
    }
    media {
      images
      link
      videoProcessingStatus
      playbackId
      __typename
    }
    __typename
  }
`

export const ActivityFeedComment = gql`
  fragment ActivityFeedComment on FeedItem {
    ...ActivityFeedItem
    commentReacted
  }
  ${ActivityFeedItem}
`
