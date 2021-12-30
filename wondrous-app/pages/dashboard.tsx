import React from 'react'
import styled from 'styled-components'
import AppLayout from '../components/Common/Layout/App'
import { ToDo, InProgress, Done } from '../components/Icons'
import { InReview } from '../components/Icons/sections'
import { GmBox, WelcomeMessage } from '../components/Pages/home'
import KanbanBoard from '../components/Common/KanbanBoard/kanbanBoard'
import * as Constants from '../utils/constants'
import { withAuth } from '../components/Auth/withAuth'
import { BoardsActivity, BoardsActivityInput, BoardsContainer } from '../components/organization/boards/styles'
import { InputAdornment } from '@material-ui/core'
import SearchIcon from '../components/Icons/search'
import { MultiSelect } from '../components/Common/MultiSelect'
import MetricsPanel from '../components/Common/Metrics'
import { ToggleViewButton } from '../components/Common/ToggleViewButton'

const TO_DO_TASKS_LIST = [
	{
		id: 11,
		title: 'Create twitter analytics template',
		description:
			'Design google sheet where we can get an open look at our twitters performance ✨🦄',
		status: Constants.TASK_STATUS_TODO,
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
		title: 'Create twitter analytics template',
		description:
			'Design google sheet where we can get an open look at our twitters performance ✨🦄',
		status: Constants.TASK_STATUS_TODO,
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
]

const IN_PROGRESS_TASKS_LIST = [
	{
		id: 21,
		title: 'Create twitter analytics template',
		description:
			'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
		status: Constants.TASK_STATUS_IN_PROGRESS,
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
		title: 'Create twitter analytics template',
		description:
			'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
		status: Constants.TASK_STATUS_IN_PROGRESS,
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
]

const DONE_TASKS_LIST = [
	{
		id: 31,
		title: 'Get 10,000 Twitter followers',
		description:
			'Design google sheet where we can get an open look at our twitters performance ✨🦄 ',
		status: Constants.TASK_STATUS_DONE,
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
		title: 'Create twitter analytics template',
		description:
			'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
		status: Constants.TASK_STATUS_DONE,
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
]

const TASKS_LIST = [
	...TO_DO_TASKS_LIST,
	...IN_PROGRESS_TASKS_LIST,
	...DONE_TASKS_LIST,
]

const SELECT_OPTIONS = [
	'#copywriting (23)',
	'#growth (23)',
	'#design (23)',
	'#community (11)',
	'#sales (23)',
	'#tiktok (13)',
	'#analytics (23)',
]

const DashboardBanner = styled.div`
	position: absolute;
	top: 0;
	z-index: 1;
	width: 100%;

	height: 220px;

	background: url(/images/dashboard-banner.png);
	background-position: center;
	background-size: cover;
`

const DashboardActivity = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	justify-content: space-evenly;

	width: 100%;

	& > *:not(:first-child) {
		margin-left: 15px;
	}
`

const Home = () => {
	const listViewOptions = [
		{
			name: 'List',
			action: () => { console.log('Show List View') }
		},
		{
			name: 'Grid',
			active: true,
			action: () => { console.log('Show Grid View') }
		}
	]

	return (
		<AppLayout banner={<DashboardBanner />}>

			{/* <WelcomeMessage>
				<GmBox>☀️gm</GmBox>
				<span>Welcome to Wonderverse!</span>
			</WelcomeMessage> */}

			<MetricsPanel />

			<BoardsContainer>
				<DashboardActivity>
					<BoardsActivityInput
						placeholder="Search people or tasks..."
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>

					<MultiSelect style={{ width: '50%' }} options={SELECT_OPTIONS} />
					<ToggleViewButton options={listViewOptions}/>
				</DashboardActivity>

				<KanbanBoard tasksList={TASKS_LIST} />
			</BoardsContainer>
		</AppLayout>
	)
}
export default withAuth(Home)
