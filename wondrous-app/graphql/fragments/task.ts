import { gql } from '@apollo/client'

export const TaskCardFragment = gql`
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
			userMentions
			reviewerIds
		}
		# NOTE: These fields are failing to be fetched 
		# images
		# muxPlaybackId
	}
`
