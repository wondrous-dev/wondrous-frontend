import { gql } from '@apollo/client';

export const NotificationFragment = gql`
  fragment NotificationFragment on NotificationItem {
    id
    timestamp
    userId
    viewedAt
    actorId
    actorType
    actorUsername
    actorProfilePicture
    actorThumbnail
    type
    objectType
    objectId
    objectName
    additionalData {
      contentPreview
      orgUsername
      addMember
    }
  }
`;
