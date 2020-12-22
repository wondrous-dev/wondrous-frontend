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
    itemName
    itemContent
    commentCount
    likeCount
    media
  }
`
