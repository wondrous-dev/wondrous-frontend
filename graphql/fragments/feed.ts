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
    parentCommentId
    itemName
    itemContent
    commentCount
    reactionCount
    media {
      images
      link
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
