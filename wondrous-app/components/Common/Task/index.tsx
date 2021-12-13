import { LogoButton } from '../logo'
import { ToDo, InProgress, Done } from '../../Icons'
import { TaskLikeIcon } from '../../Icons/taskLike'
import { TaskCommentIcon } from '../../Icons/taskComment'
import { TaskShareIcon } from '../../Icons/taskShare'
import { TaskMenuIcon } from '../../Icons/taskMenu'

import { AvatarList } from '../AvatarList'
import { Compensation } from '../Compensation'
import { TaskMedia } from './media'
import { DropDown, DropDownItem } from '../dropdown'

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

export const Task = (props) => {
	let task = props.task
	let TaskIcon = ToDo

	if (task.taskType === 'INPROGRESS') {
		TaskIcon = InProgress
	} else if (task.taskType === 'DONE') {
		TaskIcon = Done
	}

	let likes = task.actions ? task.actions.likes : 0
	let comments = task.actions ? task.actions.comments : 0
	let shares = task.actions ? task.actions.shares : 0

	const editTask = () => {
		console.log('Edit Task Menu Clicked')
	}

	const reportTask = () => {
		console.log('Report Task Menu Clicked')
	}

	const openSettings = () => {
		console.log('Open Task Settings Menu Clicked')
	}

	return (
		<TaskWrapper key={task.id}>
			<TaskInner>
				<TaskHeader>
					<LogoButton />
					<AvatarList users={task.users} />
					<Compensation compensation={task.compensation} icon={TaskIcon}/>
				</TaskHeader>
				<TaskContent>
					<TaskTitle>{task.title}</TaskTitle>
					<p>{task.description}</p>
					{task.media ? <TaskMedia media={task.media} /> : <TaskSeparator />}
				</TaskContent>
				<TaskFooter>
					<TaskAction key={'task-like-' + task.id}>
						<TaskLikeIcon />
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
						<DropDown handler={TaskMenuIcon}>
							<DropDownItem key={'task-menu-edit-' + task.id} onClick={editTask}>Edit task</DropDownItem>
							<DropDownItem key={'task-menu-report-' + task.id} onClick={reportTask}>Report</DropDownItem>
							<DropDownItem key={'task-menu-report-' + task.id} onClick={openSettings}>Settings</DropDownItem>
						</DropDown>
					</TaskActionMenu>
				</TaskFooter>
			</TaskInner>
		</TaskWrapper>
	)
}
