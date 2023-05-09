import { gql } from "@apollo/client"

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
		submissionsCount
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
		}
	}
`
