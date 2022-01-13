import React from 'react'
import About from '../../../components/profile/about/about'
import {
	SOCIAL_MEDIA_FACEBOOK,
	SOCIAL_MEDIA_LINKEDIN,
	SOCIAL_MEDIA_TWITTER,
	TASK_STATUS_DONE,
} from '../../../utils/constants'

const ORGANIZATIONS = [
	{
		id: 1,
		icon: 'wonder',
		title: 'Wonder',
		description:
			'A social platform where founders build in public using crypto incentives.',
		avatar: '/images/boards/avatar.png',
		position: 'Founder',
	},
	{
		id: 2,
		icon: 'wonder',
		title: 'UpClick',
		description:
			'Upclick is a custom e-commerce platform with expertise in sales tool.',
		avatar: '/images/boards/avatarNFT.png',
		position: 'Public Relations',
	},
]

const PODS = [
	{
		id: 1,
		title: 'PR Dream Team',
		description:
			'Tortor aliquet dui posuere tortor in viverra orci cras quisque. Lectus mauris.',
		tasksAmount: 42,
		goalsAmount: 1,
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
		id: 2,
		title: 'Analytics system creation',
		description:
			'Tortor aliquet dui posuere tortor in viverra orci cras quisque. Lectus mauris.',
		tasksAmount: 21,
		goalsAmount: 1,
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
]

const PROFILE_INFO = {
	completedTasks: 321,
	links: [
		{ link: 'http://manifesto.xyz', text: 'Our manifesto' },
		{ link: 'http://mirror.xyz', text: 'Mirror article' },
		{ link: 'http://andros.io', text: 'andros.io' },
	],
	skills: ['publicrelations', 'analytics'],
	socialMedia: [
		{
			name: SOCIAL_MEDIA_FACEBOOK,
			url: '',
		},
		{
			name: SOCIAL_MEDIA_TWITTER,
			url: '',
		},
		{
			name: SOCIAL_MEDIA_LINKEDIN,
			url: '',
		},
	],
}

const LAST_COMPLETED_TASK = {
	id: 31,
	likes: 14,
	shares: 12,
	comments: 8,
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
}

const AboutPage = () => {
	return (
		<About
			lastCompletedTask={LAST_COMPLETED_TASK}
			organizations={ORGANIZATIONS}
			profileInfo={PROFILE_INFO}
			pods={PODS}
		/>
	)
}

export default AboutPage
