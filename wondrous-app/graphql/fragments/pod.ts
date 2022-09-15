import { gql } from '@apollo/client';

export const PodInviteFragment = gql`
  fragment PodInviteFragment on Pod {
    id
    name
    username
    contributorCount
    org {
      profilePicture
      name
      username
    }
  }
`;

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
    archivedAt
    contributorCount
    tasksCompletedCount
    tasksIncompleteCount
    milestoneCount
    links {
      url
      displayName
      type
    }
    hasGr15TasksAndBounties {
      hasGr15Tasks
      hasGr15Bounties
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
