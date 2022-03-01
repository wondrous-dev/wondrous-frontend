import { gql } from '@apollo/client';

export const PodFragment = gql`
  fragment PodFragment on Pod {
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
    orgId
    tags
    color
    contributorCount
    tasksCompletedCount
    tasksIncompleteCount
    milestoneCount
    links {
      url
      displayName
      type
    }
  }
`;

export const PodRoleFragment = gql`
  fragment PodRoleFragment on PodRole {
    id
    createAt
    createdBy
    default
    permissions
    podId
    name
  }
`;
