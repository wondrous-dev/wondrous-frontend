import { gql } from "@apollo/client"

export const QuestListFragment = gql`
	fragment QuestListFragment on Quest {
		id
		createdAt
		createdBy
		title
		description
		orgId
		status
		level
		startAt
		endAt
		maxSubmission
		requireReview
		submissionsCount {
			inReview
			approved
			rejected
		}
		pointReward
		conditionLogic
	}
`

export const QuestFragment = gql`
	fragment QuestFragment on Quest {
		id
		createdAt
		createdBy
		title
		description
		orgId
		status
		level
		startAt
		endAt
		maxSubmission
		requireReview
		submissionsCount {
			inReview
			approved
			rejected
		}
		pointReward
		conditionLogic
		conditions {
			type
			conditionData {
				discordRoleId
				discordGuildId
				questId
			}
		}
		steps {
			type
			order
			prompt
			options {
				position
				text
				correct
			}
			additionalData {
				discordChannelName
				tweetHandle
				tweetLink
				tweetPhrase
				snapshotProposalLink
				snapshotSpaceLink
				snapshotVoteTimes
				discordMessageType
			}
		}
	}
`
