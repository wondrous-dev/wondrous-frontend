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
    commentReacted
    media {
      images
      link
    }
  }
`
