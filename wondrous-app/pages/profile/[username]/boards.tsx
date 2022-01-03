import React, { useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import Boards from '../../../components/profile/boards/boards'
import { GET_USER_TASK_BOARD_TASKS } from '../../../graphql/queries/taskBoard'
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
import { useRouter, userRouter } from 'next/router'
import { useEffect } from 'react'
import { GET_USER_ID_FROM_USERNAME } from '../../../graphql/queries'

const TO_DO = {
	status: TASK_STATUS_TODO,
	tasks: [
		{
			id: 11,
			title: 'Task 1',
			description:
				'Design google sheet where we can get an open look at our twitters performance ✨🦄',
			status: TASK_STATUS_TODO,
			actions: {
				comments: 18,
				likes: 30,
				shares: 13,
			},
			compensation: {
				amount: 2500,
				currency: 'wonder',
			},
			media: {
				id: 11,
				type: 'audio',
				url: 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix',
			},
			users: [
				{
					name: 'UserName',
					id: 'ea5232b9-1a6b-4ced-a368-f5f0139295ad',
					initials: 'LT',
					avatar: {
						id: 'e5c92eca-7218-418f-a74b-7cf4932f6a36',
						isOwnerOfPod: true,
					},
				},
				{
					name: 'AnotherUser',
					id: 'a7d1d8d5-ee35-4519-b9ec-dd42f71bea93',
					initials: 'AA',
				},
			],
		},
		{
			id: 12,
			title: 'Task 2',
			description:
				'Design google sheet where we can get an open look at our twitters performance ✨🦄',
			status: TASK_STATUS_TODO,
			actions: {
				comments: 8,
				likes: 43,
				shares: 11,
			},
			compensation: {
				amount: 1200,
				currency: 'wonder',
			},
			media: {
				id: 12,
				type: 'image',
				url: '/images/boards/space.png',
			},
			users: [
				{
					name: 'Third User',
					id: 'beafc448-5a68-4382-9aad-1de24ead8563',
					initials: 'OP',
				},
			],
		},
	],
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
		tasks: [
			{
				title: 'Web3 Instagram Post',
				id: '8e5b842e-3a6a-4d7b-9658-4e253e240b39',
				taskType: TASK_STATUS_REQUESTED,
				users: [
					{
						name: 'UserName',
						id: '0c4db830-f31a-4d5b-8863-00612f4b2501',
						avatar: {
							id: 'c2a10d67-6046-4395-89b8-3cdb466625ed',
							isOwnerOfPod: true,
						},
					},
					{
						name: 'AnotherUser',
						id: 'bb44d5ac-b09e-4b62-9b2c-2c625250b843',
					},
				],
				description: `Here's what I am thinking for the web3 insta post`,
				priority: 1,
				media: {
					id: '2c67291e-6fbe-4e62-b687-8a4e9bc9a4fc',
					type: 'image',
					url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.windowsreport.com%2Fwp-content%2Fuploads%2F2018%2F10%2FMozilla-Firefox-memory-leak.jpg&f=1&nofb=1',
				},
				actions: {
					likes: 0,
					comments: 0,
					shares: 0,
				},
			},
			{
				title: 'Task 4',
				id: '8aed37ba-2bcd-48d1-9d4e-4e75ce4562c5',
				taskType: TASK_STATUS_REQUESTED,
				users: [
					{
						name: 'UserName',
						id: 'b36555db-68dd-4595-a9eb-7d910d1fb61c',
						avatar: {
							id: '507100df-4a00-40dd-a613-8ee705bd12de',
							isOwnerOfPod: true,
						},
					},
					{
						name: 'AnotherUser',
						id: 'ac7bb8ff-1a3d-47f2-aacf-ac1ef414e7af',
					},
				],
				description: 'This is description for Task #4',
				media: {
					id: 'db006231-6f00-42eb-9687-463ea0d393d6',
					type: 'audio',
					url: 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix',
				},
				actions: {
					likes: 0,
					comments: 0,
					shares: 0,
				},
			},
		],
	},
}

const IN_PROGRESS = {
	status: TASK_STATUS_IN_PROGRESS,
	tasks: [
		{
			id: 21,
			title: 'Task 3',
			description:
				'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
			status: TASK_STATUS_IN_PROGRESS,
			actions: {
				comments: 81,
				likes: 144,
				shares: 52,
			},
			compensation: {
				amount: 3100,
				currency: 'wonder',
			},
			media: {
				id: 21,
				type: 'image',
				url: '/images/boards/space.png',
			},
			users: [
				{
					name: 'Third User',
					id: 'beac6b46-0b6b-4e23-b1b3-50492294e3e6',
					initials: 'IK',
				},
				{
					name: 'Third User',
					id: '976228a0-46da-440e-9c30-f98157ea1768',
					initials: 'ZZ',
				},
				{
					name: 'Third User',
					id: 'bf551338-b9c9-41d2-b984-6cdc1714bce6',
					initials: 'RT',
				},
			],
		},
		{
			id: 22,
			title: 'Task 4',
			description:
				'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
			status: TASK_STATUS_IN_PROGRESS,
			actions: {
				comments: 81,
				likes: 144,
				shares: 52,
			},
			compensation: {
				amount: 2100,
				currency: 'wonder',
			},
			media: {
				id: 22,
				type: 'video',
				url: 'https://www.youtube.com/watch?v=HmpP7e9gLYs',
			},
			users: [
				{
					name: 'Third User',
					id: '0770c50c-8598-4b2a-ad75-0f58d5937e89',
					initials: 'JA',
				},
			],
		},
	],
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
		tasks: [
			{
				title: 'Web3 Instagram Post',
				id: '8e5b842e-3a6a-4d7b-9658-4e253e240b39',
				taskType: TASK_STATUS_IN_REVIEW,
				users: [
					{
						name: 'UserName',
						id: '0c4db830-f31a-4d5b-8863-00612f4b2501',
						avatar: {
							id: 'c2a10d67-6046-4395-89b8-3cdb466625ed',
							isOwnerOfPod: true,
						},
					},
					{
						name: 'AnotherUser',
						id: 'bb44d5ac-b09e-4b62-9b2c-2c625250b843',
					},
				],
				description: `Here's what I am thinking for the web3 insta post`,
				priority: 1,
				media: {
					id: '2c67291e-6fbe-4e62-b687-8a4e9bc9a4fc',
					type: 'image',
					url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.windowsreport.com%2Fwp-content%2Fuploads%2F2018%2F10%2FMozilla-Firefox-memory-leak.jpg&f=1&nofb=1',
				},
				actions: {
					likes: 0,
					comments: 0,
					shares: 0,
				},
			},
			{
				title: 'Task 4',
				id: '8aed37ba-2bcd-48d1-9d4e-4e75ce4562c5',
				taskType: TASK_STATUS_IN_REVIEW,
				users: [
					{
						name: 'UserName',
						id: 'b36555db-68dd-4595-a9eb-7d910d1fb61c',
						avatar: {
							id: '507100df-4a00-40dd-a613-8ee705bd12de',
							isOwnerOfPod: true,
						},
					},
					{
						name: 'AnotherUser',
						id: 'ac7bb8ff-1a3d-47f2-aacf-ac1ef414e7af',
					},
				],
				description: 'This is description for Task #4',
				media: {
					id: 'db006231-6f00-42eb-9687-463ea0d393d6',
					type: 'audio',
					url: 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix',
				},
				actions: {
					likes: 0,
					comments: 0,
					shares: 0,
				},
			},
		],
	},
}

const DONE = {
	status: TASK_STATUS_DONE,
	tasks: [
		{
			id: 31,
			title: 'Get 10,000 Twitter followers',
			description:
				'Design google sheet where we can get an open look at our twitters performance ✨🦄 ',
			status: TASK_STATUS_DONE,
			actions: {
				comments: 8,
				likes: 14,
				shares: 12,
			},
			compensation: {
				amount: 2600,
				currency: 'wonder',
			},
			media: {
				id: 31,
				type: 'video',
				url: 'https://www.youtube.com/watch?v=HmpP7e9gLYs',
			},
			users: [
				{
					name: 'Third User',
					id: '0770c50c-8598-4b2a-ad75-0f58d5937e89',
					initials: 'JA',
				},
				{
					name: 'AnotherUser',
					id: 'a7d1d8d5-ee35-4519-b9ec-dd42f71bea93',
					initials: 'AA',
				},
			],
		},
		{
			id: 32,
			title: 'Task 5',
			description:
				'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
			status: TASK_STATUS_DONE,
			actions: {
				comments: 181,
				likes: 17,
				shares: 5,
			},
			compensation: {
				amount: 2400,
				currency: 'wonder',
			},
			media: {
				id: 32,
				type: 'audio',
				url: 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix',
			},
			users: [
				{
					name: 'AnotherUser',
					id: 'a7d1d8d5-ee35-4519-b9ec-dd42f71bea93',
					initials: 'AA',
				},
				{
					name: 'Third User',
					id: '0770c50c-8598-4b2a-ad75-0f58d5937e89',
					initials: 'JA',
				},
			],
		},
	],
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
		tasks: [
			{
				title: 'Web3 Instagram Post',
				id: '8e5b842e-3a6a-4d7b-9658-4e253e240b39',
				taskType: TASK_STATUS_ARCHIVED,
				users: [
					{
						name: 'UserName',
						id: '0c4db830-f31a-4d5b-8863-00612f4b2501',
						avatar: {
							id: 'c2a10d67-6046-4395-89b8-3cdb466625ed',
							isOwnerOfPod: true,
						},
					},
					{
						name: 'AnotherUser',
						id: 'bb44d5ac-b09e-4b62-9b2c-2c625250b843',
					},
				],
				description: `Here's what I am thinking for the web3 insta post`,
				priority: 1,
				media: {
					id: '2c67291e-6fbe-4e62-b687-8a4e9bc9a4fc',
					type: 'image',
					url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.windowsreport.com%2Fwp-content%2Fuploads%2F2018%2F10%2FMozilla-Firefox-memory-leak.jpg&f=1&nofb=1',
				},
				actions: {
					likes: 0,
					comments: 0,
					shares: 0,
				},
			},
			{
				title: 'Task 4',
				id: '8aed37ba-2bcd-48d1-9d4e-4e75ce4562c5',
				taskType: TASK_STATUS_ARCHIVED,
				users: [
					{
						name: 'UserName',
						id: 'b36555db-68dd-4595-a9eb-7d910d1fb61c',
						avatar: {
							id: '507100df-4a00-40dd-a613-8ee705bd12de',
							isOwnerOfPod: true,
						},
					},
					{
						name: 'AnotherUser',
						id: 'ac7bb8ff-1a3d-47f2-aacf-ac1ef414e7af',
					},
				],
				description: 'This is description for Task #4',
				media: {
					id: 'db006231-6f00-42eb-9687-463ea0d393d6',
					type: 'audio',
					url: 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix',
				},
				actions: {
					likes: 0,
					comments: 0,
					shares: 0,
				},
			},
		],
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
	const [columns, setColumns] = useState([])
	const [statuses, setStatuses] = useState(DEFAULT_STATUS_ARR)
	const [profileUserId, setProfileUserId] = useState(null)
	const user = useMe()
	const router = useRouter()
	const { username, userId } = router.query

	const [
		getUserTasks,
		{
			loading: userTasksLoading,
			data: userTasksData,
			error: userTasksError,
			refetch: userTasksRefetch,
			fetchMore: userTasksFetchMore,
		},
	] = useLazyQuery(GET_USER_TASK_BOARD_TASKS)
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
		}
	}, [
		username,
		userId,
		profileUserId,
		getUserTasks,
		statuses,
		getUserIdFromUsername,
	])

	return <Boards selectOptions={SELECT_OPTIONS} columns={COLUMNS} />
}

export default BoardsPage
