import { gql } from '@apollo/client';

export const OrgInviteFragment = gql`
  fragment OrgInviteFragment on Org {
    id
    name
    username
    profilePicture
    contributorCount
  }
`;

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
    tags
    contributorCount
    podCount
    links {
      url
      displayName
      type
    }
    integrations {
      key
      url
      displayName
      type
    }
  }
`;

export const OrgRoleFragment = gql`
  fragment OrgRoleFragment on OrgRole {
    id
    createAt
    createdBy
    default
    permissions
    orgId
    name
  }
`;
