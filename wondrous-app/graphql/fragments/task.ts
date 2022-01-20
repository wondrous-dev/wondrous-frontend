import { gql } from '@apollo/client'

export const TaskFragment = gql`
  fragment TaskFragment on Task {
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
      slug
      name
      type
      muxAssetId
      muxPlaybackId
      videoProcessingStatus
    }
    assignee {
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
    }
    reactionCount
    commentCount
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
    }
  }
`

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
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
    }
    links {
      url
      name
      type
    }
    media {
      slug
      name
      type
      muxAssetId
      muxPlaybackId
      videoProcessingStatus
    }
  }
`
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
      name
      type
    }
    media {
      slug
      name
      type
      muxAssetId
      muxPlaybackId
      videoProcessingStatus
    }
  }
`

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
    title
    description
    approvedAt
    changeRequestedAt
    rejectedAt
    lastReviewedBy
    links {
      url
      name
      type
    }
    media {
      slug
      name
      type
      muxAssetId
      muxPlaybackId
      videoProcessingStatus
    }
  }
`

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
      name
      type
    }
    approvedAt
    changeRequestedAt
    rejectedAt
    lastReviewedBy
    org {
      profilePicture
      name
      username
    }
    pod {
      name
      username
    }
    creator {
      username
      profilePicture
    }
    media {
      slug
      name
      type
      muxAssetId
      muxPlaybackId
      videoProcessingStatus
    }
    reactionCount
    commentCount
  }
`
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
      name
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
      slug
      name
      type
      muxAssetId
      muxPlaybackId
      videoProcessingStatus
    }
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
    }
    reactionCount
    commentCount
    org {
      profilePicture
      name
      username
    }
    pod {
      name
    }
  }
`
