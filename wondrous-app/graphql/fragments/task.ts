import { gql } from '@apollo/client';
import { MediaFragment } from './media';

export const TaskFragment = gql`
  fragment TaskFragment on Task {
    id
    title
    createdAt
    createdBy
    description
    milestoneId
    parentTaskId
    orgId
    podId
    type
    priority
    blockerTaskIds
    dueDate
    status
    paymentStatus
    links {
      url
      displayName
      type
    }
    assigneeId
    userMentions
    media {
      ...MediaFragment
    }
    assignee {
      username
      profilePicture
    }
    creator {
      username
      profilePicture
    }
    org {
      profilePicture
      name
      username
    }
    pod {
      name
      color
    }
    milestone {
      title
    }
    orgOrder
    podOrder
    assigneeOrder
    reactionCount
    commentCount
    privacyLevel
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
    }
    maxSubmissionCount
  }
  ${MediaFragment}
`;

export const TaskCardFragment = gql`
  # emits reviewerIds, userMentions
  fragment TaskCardFragment on TaskCard {
    id
    createdAt
    createdBy
    type
    orgId
    orgProfilePicture
    orgName
    podId
    podProfilePicture
    podName
    podColor
    title
    description
    assigneeId
    assigneeUsername
    assigneeProfilePicture
    priority
    dueDate
    status
    completedAt
    reactionCount
    commentCount
    shareCount
    orgOrder
    podOrder
    assigneeOrder
    paymentStatus
    privacyLevel
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
    }
    links {
      url
      displayName
      type
    }
    media {
      ...MediaFragment
    }
    parentTaskId
    totalSubtaskCount
    completedSubtaskCount
    totalSubmissionsCount
    approvedSubmissionsCount
  }
  ${MediaFragment}
`;
// Omitting reactionCount, commentCount, share Count
export const TaskProposalCardFragment = gql`
  fragment TaskProposalCardFragment on TaskProposalCard {
    id
    createdAt
    type
    createdBy
    creatorUsername
    creatorProfilePicture
    orgId
    orgProfilePicture
    orgName
    podId
    podProfilePicture
    podName
    podColor
    title
    description
    approvedAt
    changeRequestedAt
    lastReviewedBy
    rejectedAt
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
    }
    links {
      url
      displayName
      type
    }
    media {
      ...MediaFragment
    }
    snapshotProposal
  }
  ${MediaFragment}
`;

export const TaskSubmissionCardFragment = gql`
  fragment TaskSubmissionCardFragment on TaskSubmissionCard {
    id
    createdAt
    createdBy
    creatorUsername
    creatorProfilePicture
    taskId
    orgId
    orgProfilePicture
    orgName
    podId
    podProfilePicture
    podName
    podColor
    title
    description
    approvedAt
    changeRequestedAt
    rejectedAt
    lastReviewedBy
    paymentStatus
    links {
      url
      displayName
      type
    }
    media {
      ...MediaFragment
    }
  }
  ${MediaFragment}
`;

export const TaskSubmissionFragment = gql`
  fragment TaskSubmissionFragment on TaskSubmission {
    id
    createdAt
    createdBy
    description
    orgId
    podId
    taskId
    links {
      url
      displayName
      type
    }
    approvedAt
    changeRequestedAt
    rejectedAt
    lastReviewedBy
    paymentStatus
    org {
      profilePicture
      name
      username
    }
    pod {
      name
      username
      color
    }
    creator {
      username
      profilePicture
    }
    media {
      ...MediaFragment
    }
  }
  ${MediaFragment}
`;
export const TaskProposalFragment = gql`
  fragment TaskProposalFragment on TaskProposal {
    id
    title
    createdAt
    createdBy
    description
    milestoneId
    orgId
    podId
    priority
    dueDate
    links {
      url
      displayName
      type
    }
    userMentions
    approvedAt
    changeRequestedAt
    rejectedAt
    lastReviewedBy
    associatedTaskId
    creator {
      username
      profilePicture
    }
    media {
      ...MediaFragment
    }
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
    }
    commentCount
    org {
      profilePicture
      name
      username
    }
    pod {
      name
      color
    }
    snapshotProposal
  }
  ${MediaFragment}
`;

export const BountyFragment = gql`
  fragment BountyFragment on Bounty {
    id
    title
    createdAt
    createdBy
    description
    milestoneId
    orgId
    podId
    type
    priority
    blockerTaskIds
    dueDate
    status
    links {
      url
      displayName
      type
    }
    assigneeId
    userMentions
    media {
      ...MediaFragment
    }
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
    }
    org {
      profilePicture
      name
      username
    }
    pod {
      name
      color
    }
    milestone {
      title
    }
    reviewers {
      username
    }
    reactionCount
    commentCount
    orgOrder
    podOrder
    assigneeOrder
    paymentStatus
    parentTaskId
    privacyLevel
    maxSubmissionCount
  }
  ${MediaFragment}
`;
