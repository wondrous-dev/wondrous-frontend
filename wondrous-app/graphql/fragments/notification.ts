import { gql } from '@apollo/client'

export const NotificationFragment = gql`
  fragment NotificationFragment on NotificationItem {
    id
    timestamp
    userId
    viewedAt
    actorId
    verb
    type
    objectType
    objectId
    objectName
    message
    actorFirstName
    actorLastName
    actorUsername
    actorProfilePicture
    actorThumbnail
  }
`
