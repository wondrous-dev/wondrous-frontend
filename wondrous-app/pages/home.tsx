import React from 'react'
import AppLayout from '../components/Common/Layout/App'
import { ToDo, InProgress, Done } from '../components/Icons'
import { GmBox, WelcomeMessage } from '../components/Pages/home'
import { KanbanBoard } from '../components/Pages/boards'

const MOCK_COLUMNS = [
	{
		title: 'To-Do',
		icon: ToDo,
		tasks: [
			{
				title: 'Task 1',
				users: [
					{
						name: 'UserName',
						initials: 'LT',
						avatar: {
							isOwnerOfPod: true
						}
					},
					{
						name: 'AnotherUser',
						initials: 'AA',
					},
					{
						name: 'Third User',
						initials: 'OP',
					},
					{
						name: 'Third User',
						initials: 'IK',
					},
					{
						name: 'Third User',
						initials: 'ZZ',
					},
					{
						name: 'Third User',
						initials: 'RT',
					},
					{
						name: 'Third User',
						initials: 'JA',
					}
				],
				description: 'This is Task #1',
				media: {
					type: 'image',
					url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.windowsreport.com%2Fwp-content%2Fuploads%2F2018%2F10%2FMozilla-Firefox-memory-leak.jpg&f=1&nofb=1'
				},
				priority: 1,
				actions: {
					likes: 18,
					comments: 12,
					shares: 9
				}
			},
			{
				title: 'Task 2',
				users: [
					{
						name: 'UserName',
						avatar: {
							isOwnerOfPod: true
						}
					},
					{
						name: 'AnotherUser'
					}
				],
				description: 'This is description for Task #2'
			}
		]
	},
	{
		title: 'In Progress',
		icon: InProgress,
		tasks: [
			{
				title: 'Task 3',
				users: [
					{
						name: 'UserName',
						avatar: {
							isOwnerOfPod: true
						}
					},
					{
						name: 'AnotherUser'
					}
				],
				description: 'This is Task #3',
				priority: 1
			},
			{
				title: 'Task 4',
				users: [
					{
						name: 'UserName',
						avatar: {
							isOwnerOfPod: true
						}
					},
					{
						name: 'AnotherUser'
					}
				],
				description: 'This is description for Task #4'
			}
		]
	},
	{
		title: 'Done',
		icon: Done,
		tasks: [
			{
				title: 'Task 5',
				users: [
					{
						name: 'UserName',
						avatar: {
							isOwnerOfPod: true
						}
					},
					{
						name: 'AnotherUser'
					}
				],
				description: 'This is Task #5',
				priority: 1
			},
			{
				title: 'Task 6',
				users: [
					{
						name: 'UserName',
						avatar: {
							isOwnerOfPod: true
						}
					},
					{
						name: 'AnotherUser'
					}
				],
				description: 'This is description for Task #6'
			}
		]
	}
]

const Home = () => {

	return (
		<AppLayout>
			<WelcomeMessage>
				<GmBox>☀️gm</GmBox>
				<span>Welcome to Wonderverse!</span>
			</WelcomeMessage>
			<KanbanBoard columns={MOCK_COLUMNS} />
		</AppLayout>
	)
}

export default Home
