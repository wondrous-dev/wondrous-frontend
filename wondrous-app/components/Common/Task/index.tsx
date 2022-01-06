import React, { useState } from 'react'
import { LogoButton } from '../logo'
import { ToDo, InProgress, Done, InReview } from '../../Icons'
import { TaskLikeIcon } from '../../Icons/taskLike'
import { TaskCommentIcon } from '../../Icons/taskComment'
import { TaskShareIcon } from '../../Icons/taskShare'
import { TaskMenuIcon } from '../../Icons/taskMenu'

import { AvatarList } from '../AvatarList'
import { Compensation } from '../Compensation'
import { TaskMedia } from '../MediaPlayer'
import { DropDown, DropDownItem } from '../dropdown'

import * as Constants from '../../../utils/constants'

import {
	TaskWrapper,
	TaskInner,
	TaskHeader,
	TaskContent,
	TaskTitle,
	TaskSeparator,
	TaskFooter,
	TaskAction,
	TaskActionAmount,
	TaskActionMenu,
} from './styles'

export const TASK_ICONS = {
	[Constants.TASK_STATUS_TODO]: ToDo,
	[Constants.TASK_STATUS_IN_PROGRESS]: InProgress,
	[Constants.TASK_STATUS_DONE]: Done,
	[Constants.TASK_STATUS_IN_REVIEW]: InReview,
}

export const Task = ({ task, setTask }) => {
	const {
		actions = {},
		description = '',
		compensation = {},
		id,
		media,
		status,
		milestone = false,
		title = '',
		users = [],
	} = task

	let {
		likes = 0,
		comments = 0,
		shares = 0,
		iLiked = false,
		iCommented = false,
		iShared = false,
	} = actions || {}

	const [liked, setLiked] = useState(iLiked)

	let TaskIcon = TASK_ICONS[status]

	const editTask = () => {
		console.log('Edit Task Menu Clicked')
	}

	const reportTask = () => {
		console.log('Report Task Menu Clicked')
	}

	const openSettings = () => {
		console.log('Open Task Settings Menu Clicked')
	}

	const toggleLike = () => {
		setLiked(!liked)

		likes = liked ? likes - 1 : likes + 1

		setTask({
			...task,
			actions: {
				...actions,
				likes,
			},
		})
	}

	return (
		<TaskWrapper key={id} wrapped={milestone}>
			<TaskInner>
				<TaskHeader>
					<LogoButton />
					<AvatarList id={id} users={users} />
					<Compensation compensation={compensation} icon={TaskIcon} />
				</TaskHeader>
				<TaskContent>
					<TaskTitle>{title}</TaskTitle>
					<p>{description}</p>
					{media ? <TaskMedia media={media} /> : <TaskSeparator />}
				</TaskContent>
				<TaskFooter>
					<TaskAction key={'task-like-' + id} onClick={toggleLike}>
						<TaskLikeIcon liked={liked} />
						<TaskActionAmount>{likes}</TaskActionAmount>
					</TaskAction>
					<TaskAction key={'task-comment-' + id}>
						<TaskCommentIcon />
						<TaskActionAmount>{comments}</TaskActionAmount>
					</TaskAction>
					<TaskAction key={'task-share-' + id}>
						<TaskShareIcon />
						<TaskActionAmount>{shares}</TaskActionAmount>
					</TaskAction>
					<TaskActionMenu right="true">
						<DropDown DropdownHandler={TaskMenuIcon}>
							<DropDownItem key={'task-menu-edit-' + id} onClick={editTask}>
								Edit task
							</DropDownItem>
							<DropDownItem key={'task-menu-report-' + id} onClick={reportTask}>
								Report
							</DropDownItem>
							<DropDownItem
								key={'task-menu-settings-' + id}
								onClick={openSettings}
							>
								Settings
							</DropDownItem>
						</DropDown>
					</TaskActionMenu>
				</TaskFooter>
			</TaskInner>
		</TaskWrapper>
	)
}
