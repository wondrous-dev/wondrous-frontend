import React from 'react'
import AppLayout from '../components/Common/Layout/App'
import { ToDo, InProgress, Done } from '../components/Icons'
import { GmBox, WelcomeMessage } from '../components/Pages/home'
import { KanbanBoard } from '../components/Pages/boards'

const MOCK_COLUMNS_DATA = [
	{
		id: '21803b3b-73ea-4f93-b0a3-b11e143375b7',
		title: 'To-Do',
		icon: ToDo,
		tasks: [
			{
				title: 'Task 1',
				id: '4d4444de-d1cd-47ff-9219-d25b3015699f',
				users: [
					{
						name: 'UserName',
						id: 'ea5232b9-1a6b-4ced-a368-f5f0139295ad',
						initials: 'LT',
						avatar: {
							id: 'e5c92eca-7218-418f-a74b-7cf4932f6a36',
							isOwnerOfPod: true
						}
					},
					{
						name: 'AnotherUser',
						id: 'a7d1d8d5-ee35-4519-b9ec-dd42f71bea93',
						initials: 'AA',
					},
					{
						name: 'Third User',
						id: 'beafc448-5a68-4382-9aad-1de24ead8563',
						initials: 'OP',
					},
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
					{
						name: 'Third User',
						id: '0770c50c-8598-4b2a-ad75-0f58d5937e89',
						initials: 'JA',
					}
				],
				description: 'This is Task #1',
				taskType: 'TODO',
				media: {
					id: '2c67291e-6fbe-4e62-b687-8a4e9bc9a4fc',
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
				id: '632348bf-b202-451a-b67e-9e074afcfd87',
				taskType: 'TODO',
				users: [
					{
						name: 'UserName',
						id: 'b6720780-f82e-4079-a4c6-017561140308',
						avatar: {
							id: 'f89333be-6034-412e-be0d-7881e7efaa5c',
							isOwnerOfPod: true
						}
					},
					{
						name: 'AnotherUser',
						id: '760ff8fa-2b39-4b4a-8c52-21f7622072a9',
					}
				],
				description: 'This is description for Task #2',
				media: {
					id: '14dcb3cc-3a04-4314-a1b1-e9f6a0bbe57e',
					type: 'video',
					url: 'https://www.youtube.com/watch?v=HmpP7e9gLYs'
				},
				actions: {
					likes: 0,
					comments: 0,
					shares: 0
				}
			}
		]
	},
	{
		title: 'In Progress',
		id: '4e0b2ae8-f1d5-49d6-98ac-c28ae7b767f7',
		icon: InProgress,
		tasks: [
			{
				title: 'Task 3',
				id: '8e5b842e-3a6a-4d7b-9658-4e253e240b39',
				taskType: 'INPROGRESS',
				users: [
					{
						name: 'UserName',
						id: '0c4db830-f31a-4d5b-8863-00612f4b2501',
						avatar: {
							id: 'c2a10d67-6046-4395-89b8-3cdb466625ed',
							isOwnerOfPod: true
						}
					},
					{
						name: 'AnotherUser',
						id: 'bb44d5ac-b09e-4b62-9b2c-2c625250b843',
					}
				],
				description: 'This is Task #3',
				priority: 1,
				actions: {
					likes: 0,
					comments: 0,
					shares: 0
				}
			},
			{
				title: 'Task 4',
				id: '8aed37ba-2bcd-48d1-9d4e-4e75ce4562c5',
				taskType: 'INPROGRESS',
				users: [
					{
						name: 'UserName',
						id: 'b36555db-68dd-4595-a9eb-7d910d1fb61c',
						avatar: {
							id: '507100df-4a00-40dd-a613-8ee705bd12de',
							isOwnerOfPod: true
						}
					},
					{
						name: 'AnotherUser',
						id: 'ac7bb8ff-1a3d-47f2-aacf-ac1ef414e7af',
					}
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
					shares: 0
				}
			}
		]
	},
	{
		title: 'Done',
		id: '2828bd1a-1f9b-479d-bd5d-740412c2d96b',
		icon: Done,
		tasks: [
			{
				title: 'Task 5',
				id: '8bc14067-3f90-461c-98fd-6c2b56451304',
				taskType: 'DONE',
				users: [
					{
						name: 'UserName',
						id: '1c9c207d-f694-4658-9321-e292eb16ecfd',
						avatar: {
							isOwnerOfPod: true
						}
					},
					{
						name: 'AnotherUser',
						id: '4013195f-8715-4696-b504-fce9b2d4ae25',
					}
				],
				description: 'This is Task #5',
				priority: 1,
				actions: {
					likes: 0,
					comments: 0,
					shares: 0
				}
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
			<KanbanBoard columns={MOCK_COLUMNS_DATA} />
		</AppLayout>
	)
}

export default Home
