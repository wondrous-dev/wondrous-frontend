import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import Boards from '../../../components/profile/boards/boards'
import {
	GET_USER_TASK_BOARD_PROPOSALS,
	GET_USER_TASK_BOARD_SUBMISSIONS,
	GET_USER_TASK_BOARD_TASKS,
} from '../../../graphql/queries/taskBoard'
import { useMe } from '../../../components/Auth/withAuth'

import {
	InReview,
	Requested,
	Archived,
} from '../../../components/Icons/sections'
import {
	TASK_STATUS_DONE,
	TASK_STATUS_IN_PROGRESS,
	TASK_STATUS_TODO,
	TASK_STATUS_REQUESTED,
	TASK_STATUS_IN_REVIEW,
	TASK_STATUS_ARCHIVED,
	DEFAULT_STATUS_ARR,
} from '../../../utils/constants'
import { GET_USER_ID_FROM_USERNAME } from '../../../graphql/queries'

const TO_DO = {
	status: TASK_STATUS_TODO,
	tasks: [],
	section: {
		title: 'Requests',
		icon: Requested,
		id: '337d2b80-65fd-48ca-bb17-3c0155162a62',
		filter: {
			taskType: TASK_STATUS_REQUESTED,
		},
		expandable: true,
		action: {
			text: 'Request',
		},
		tasks: [],
	},
}

const IN_PROGRESS = {
	status: TASK_STATUS_IN_PROGRESS,
	tasks: [],
	section: {
		title: 'In Review',
		icon: InReview,
		id: '337d2b80-65fd-48ca-bb17-3c0155162a62',
		filter: {
			taskType: TASK_STATUS_IN_REVIEW,
		},
		expandable: true,
		action: {
			text: 'Review',
		},
		tasks: [],
	},
}

const DONE = {
	status: TASK_STATUS_DONE,
	tasks: [],
	section: {
		title: 'Archived',
		icon: Archived,
		id: '337d2b80-65fd-48ca-bb17-3c0155162a62',
		filter: {
			taskType: TASK_STATUS_ARCHIVED,
		},
		expandable: true,
		action: {
			text: 'Restore',
		},
		tasks: [],
	},
}

const COLUMNS = [TO_DO, IN_PROGRESS, DONE]

const SELECT_OPTIONS = [
	'#copywriting (23)',
	'#growth (23)',
	'#design (23)',
	'#community (11)',
	'#sales (23)',
	'#tiktok (13)',
	'#analytics (23)',
]

const BoardsPage = () => {
	const [columns, setColumns] = useState(COLUMNS)
	const [statuses, setStatuses] = useState(DEFAULT_STATUS_ARR)
	const [profileUserId, setProfileUserId] = useState(null)
	const user = useMe()
	const router = useRouter()
	const { username, userId } = router.query

	const [getUserTaskProposals] = useLazyQuery(GET_USER_TASK_BOARD_PROPOSALS, {
		onCompleted: (data) => {
			const newColumns = [...columns]
			const taskProposals = data?.getUserTaskBoardProposals
			newColumns[0].section.tasks = []
			taskProposals.forEach((taskProposal) => {
				newColumns[0].section.tasks.push(taskProposal)
			})
			setColumns(newColumns)
		},
	})
	const [getUserTaskSubmissions] = useLazyQuery(
		GET_USER_TASK_BOARD_SUBMISSIONS,
		{
			onCompleted: (data) => {
				const newColumns = [...columns]
				const taskSubmissions = data?.getUserTaskBoardSubmissions
				newColumns[1].section.tasks = []
				taskSubmissions.forEach((taskSubmission) => {
					newColumns[0].section.tasks.push(taskSubmission)
				})
				setColumns(newColumns)
			},
		}
	)

	const [getUserTasks] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
		onCompleted: (data) => {
			// Parse task board data
			const newColumns = [...columns]
			const tasks = data?.getUserTaskBoardTasks
			newColumns[0].tasks = []
			newColumns[1].tasks = []
			newColumns[2].tasks = []
			tasks.forEach((task) => {
				if (task?.status === TASK_STATUS_TODO) {
					newColumns[0].tasks.push(task)
				} else if (task?.status === TASK_STATUS_IN_PROGRESS) {
					newColumns[1].tasks.push(task)
				} else if (task?.status === TASK_STATUS_DONE) {
					newColumns[2].tasks.push(task)
				} else if (task?.status === TASK_STATUS_ARCHIVED) {
					newColumns[2].section.tasks.push(task)
				}
			})
			setColumns(newColumns)
		},
	})
	const [
		getUserIdFromUsername,
		{ data: getUserIdFromUsernameData, error: getUserIdFromUsernameError },
	] = useLazyQuery(GET_USER_ID_FROM_USERNAME, {
		onCompleted: (data) => {
			if (data?.getUserIdFromUsername?.userId) {
				setProfileUserId(data?.getUserIdFromUsername?.userId)
			}
		},
	})

	useEffect(() => {
		if (userId) {
			// get user task board tasks immediately
			getUserTasks({
				variables: {
					userId,
					statuses,
					offset: 0,
					limit: 10,
				},
			})
		} else if (!userId && username) {
			// Get userId from username
			getUserIdFromUsername({
				variables: {
					username,
				},
			})
		}
		if (!userId && profileUserId) {
			// fetch user task boards after getting userId from username
			getUserTasks({
				variables: {
					userId: profileUserId,
					statuses,
					offset: 0,
					limit: 10,
				},
			})
			getUserTaskProposals({
				variables: {
					userId: profileUserId,
					statuses,
					offset: 0,
					limit: 10,
				},
			})

			getUserTaskSubmissions({
				variables: {
					userId: profileUserId,
					statuses,
					offset: 0,
					limit: 10,
				},
			})
		}
	}, [
		username,
		userId,
		profileUserId,
		getUserTasks,
		statuses,
		getUserIdFromUsername,
		getUserTaskSubmissions,
		getUserTaskProposals,
	])

	return <Boards selectOptions={SELECT_OPTIONS} columns={columns} />
}

export default BoardsPage
