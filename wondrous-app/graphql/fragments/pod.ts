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
      modules
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
    org {
      profilePicture
      name
      username
    }
    tags
    color
    archivedAt
    contributorCount
    tasksCompletedCount
    tasksIncompleteCount
    links {
      url
      displayName
      type
    }
    hasGr15TasksAndBounties {
      hasGr15Tasks
      hasGr15Bounties
    }
    modules {
      task
      bounty
      pod
      grant
      document
      milestone
      proposal
      collab
      leaderboard
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
