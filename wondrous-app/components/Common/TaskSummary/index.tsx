import React from 'react'
import { LogoButton } from '../logo'
import { ToDo, InProgress, Done, InReview } from '../../Icons'

import { AvatarList } from '../AvatarList'
import { Compensation } from '../Compensation'

import * as Constants from '../../../utils/constants'

import {
	TaskHeader,
	TaskContent,
	TaskTitle,
	TaskFooter,
} from '../Task/styles'

import {
	TaskSummaryWrapper,
	TaskSummaryMedia,
	TaskSummaryInner,
	TaskSummaryAction,
} from './styles'
import { Arrow, Media } from '../../Icons/sections'

const TASK_ICONS = {
	[Constants.TASK_STATUS_TODO]: ToDo,
	[Constants.TASK_STATUS_IN_PROGRESS]: InProgress,
	[Constants.TASK_STATUS_DONE]: Done,
	[Constants.TASK_STATUS_IN_REVIEW]: InReview,
}

export const TaskSummary = ({ task, setTask, action }) => {
	const {
		compensation = {},
		description = '',
		id,
		media,
		taskType,
		title = '',
		users = [],
	} = task

	let TaskIcon = TASK_ICONS[taskType]

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
