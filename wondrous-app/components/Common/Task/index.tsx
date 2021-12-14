import React, { useEffect, useState } from 'react'
import { LogoButton } from '../logo'
import { ToDo, InProgress, Done } from '../../Icons'
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

export const Task = ({ task, setTask }) => {
	const {
		actions = {},
		description,
		id,
		media,
		taskType,
		title,
		users = [],
	} = task
	const {
		likes = 0,
		comments = 0,
		shares = 0,
		iLiked = false,
		iCommented = false,
		iShared = false,
	} = actions || {}
	const [liked, setLiked] = useState(iLiked)

	let TaskIcon = ToDo
	if (task.taskType === Constants.TASK_STATUS_INPROGRESS) {
		TaskIcon = InProgress
	} else if (task.taskType === Constants.TASK_STATUS_DONE) {
		TaskIcon = Done
	}

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

		if (liked) {
			task.actions.likes -= 1
		} else {
			task.actions.likes += 1
		}
	}

	useEffect(() => {
		setTask(task)
	}, [setTask, task])

	return (
		<TaskWrapper key={task.id}>
			<TaskInner>
				<TaskHeader>
					<LogoButton />
					<AvatarList id={task.id} users={task.users} />
					<Compensation compensation={task.compensation} icon={TaskIcon} />
				</TaskHeader>
				<TaskContent>
					<TaskTitle>{task.title}</TaskTitle>
					<p>{task.description}</p>
					{task.media ? <TaskMedia media={task.media} /> : <TaskSeparator />}
				</TaskContent>
				<TaskFooter>
					<TaskAction key={'task-like-' + task.id} onClick={toggleLike}>
						<TaskLikeIcon liked={liked} />
						<TaskActionAmount>{likes}</TaskActionAmount>
					</TaskAction>
					<TaskAction key={'task-comment-' + task.id}>
						<TaskCommentIcon />
						<TaskActionAmount>{comments}</TaskActionAmount>
					</TaskAction>
					<TaskAction key={'task-share-' + task.id}>
						<TaskShareIcon />
						<TaskActionAmount>{shares}</TaskActionAmount>
					</TaskAction>
					<TaskActionMenu right="true">
						<DropDown DropdownHandler={TaskMenuIcon}>
							<DropDownItem
								key={'task-menu-edit-' + task.id}
								onClick={editTask}
							>
								Edit task
							</DropDownItem>
							<DropDownItem
								key={'task-menu-report-' + task.id}
								onClick={reportTask}
							>
								Report
							</DropDownItem>
							<DropDownItem
								key={'task-menu-settings-' + task.id}
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
