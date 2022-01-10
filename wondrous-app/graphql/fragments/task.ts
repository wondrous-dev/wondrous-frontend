import { gql } from '@apollo/client'

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
		additionalData {
			link
			images
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
		rejectedAt
		additionalData {
			link
			images
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
		rejectedAt
		additionalData {
			link
			images
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
