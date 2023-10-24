import { gql } from '@apollo/client';

export const OrgFragment = gql`
  fragment OrgFragment on Org {
    id
    name
    username
    description
    privacyLevel
    headerPicture
    profilePicture
    thumbnailPicture
    createdBy
    createdAt
    shared
    cmtyEnabled
    links {
      url
      displayName
      type
    }
  }
`;

export const OrgInviteFragment = gql`
  fragment OrgInviteFragment on Org {
    id
    name
    username
    profilePicture
    shared
  }
`;
