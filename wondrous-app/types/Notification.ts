export interface AdditionalData {
  __typename: 'NotificationAdditionalData';
  contentPreview: string;
}

export interface Notification {
  __typename: 'NotificationItem';
  id: string;
  timestamp: Date;
  userId: string;
  viewedAt: Date;
  actorId: string;
  actorType: string;
  actorUsername: string;
  actorProfilePicture: string;
  actorThumbnail: string;
  type: string;
  objectType: string;
  objectId: string;
  objectName?: any;
  additionalData: AdditionalData;
}
