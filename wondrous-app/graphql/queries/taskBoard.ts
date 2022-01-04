import { gql } from '@apollo/client'

import { TaskCardFragment } from '../fragments/task'

export const GET_ORG_TASK_BOARD_TASKS = gql`
	query getOrgTaskBoardTasks(
		$orgId: ID!
		$statuses: [String]
		$searchString: String
		$podIds: [String]
		$limit: Int
		$offset: Int
	) {
		getOrgTaskBoardTasks(
			input: {
				orgId: $orgId
				statuses: $statuses
				searchString: $searchString
				podIds: $podIds
				limit: $limit
				offset: $offset
			}
		) {
			...TaskCardFragment
		}
	}
	${TaskCardFragment}
`

export const GET_USER_TASK_BOARD_TASKS = gql`
	query getUserTaskBoardTasks(
		$userId: ID
		$statuses: [String]
		$orgId: String
		$podIds: [String]
		$limit: Int
		$offset: Int
	) {
		getUserTaskBoardTasks(
			input: {
				userId: $userId
				statuses: $statuses
				orgId: $orgId
				podIds: $podIds
				limit: $limit
				offset: $offset
			}
		) {
			...TaskCardFragment
		}
	}
	${TaskCardFragment}
`
