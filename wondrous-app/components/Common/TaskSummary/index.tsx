import React from 'react'
import { LogoButton } from '../logo'
import { AvatarList } from '../AvatarList'
import { Compensation } from '../Compensation'

import { TaskHeader, TaskContent, TaskTitle, TaskFooter } from '../Task/styles'

import { TASK_ICONS } from '../Task/index'

import {
	TaskSummaryWrapper,
	TaskSummaryMedia,
	TaskSummaryInner,
	TaskSummaryAction,
} from './styles'
import { Arrow, Media } from '../../Icons/sections'

export const TaskSummary = ({ task, setTask, action }) => {
	const {
		compensation = {},
		description = '',
		id,
		media,
		status,
		title = '',
		users = [],
	} = task

	let TaskIcon = TASK_ICONS[status]

	const openTask = () => {
		// TODO: Open Task
	}

	return (
		<TaskSummaryWrapper key={id}>
			<TaskSummaryInner>
				<TaskHeader>
					<LogoButton />
					<AvatarList id={id} users={users} />
					<Compensation compensation={compensation} icon={TaskIcon} />
				</TaskHeader>
				<TaskContent>
					<TaskTitle>{title}</TaskTitle>
					<p>{description}</p>
				</TaskContent>
				<TaskFooter>
					{media ? (
						<TaskSummaryMedia>
							<Media />
						</TaskSummaryMedia>
					) : (
						''
					)}
					{action ? (
						<TaskSummaryAction onClick={openTask}>
							{action.text}
							&nbsp;
							<Arrow />
						</TaskSummaryAction>
					) : (
						''
					)}
				</TaskFooter>
			</TaskSummaryInner>
		</TaskSummaryWrapper>
	)
}
