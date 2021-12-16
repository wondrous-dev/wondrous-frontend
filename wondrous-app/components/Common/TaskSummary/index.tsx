import React, { useEffect, useState } from 'react'
import { LogoButton } from '../logo'
import { ToDo, InProgress, Done, InReview } from '../../Icons'

import { AvatarList } from '../AvatarList'
import { Compensation } from '../Compensation'

import * as Constants from '../../../utils/constants'

import {
	TaskInner,
	TaskHeader,
	TaskContent,
	TaskTitle,
	TaskFooter,
} from '../Task/styles'

import { TaskSummaryWrapper, TaskSummaryMedia, TaskSummaryInner, TaskSummaryAction } from './styles'
import { Arrow, Media } from '../../Icons/sections'

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

	let TaskIcon = ToDo
	if (taskType === Constants.TASK_STATUS_IN_PROGRESS) {
		TaskIcon = InProgress
	} else if (taskType === Constants.TASK_STATUS_DONE) {
		TaskIcon = Done
	} else if (taskType === Constants.TASK_STATUS_IN_REVIEW) {
		TaskIcon = InReview
	}

    const openTask = () => {
        // TODO: Open Task
    }

	useEffect(() => {
		setTask(task)
	}, [setTask, task])

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
                    {
                    media 
                    ? <TaskSummaryMedia>
                        <Media />
                    </TaskSummaryMedia>
                    : ''
                    }
                    {
                    action
                    ? (
                        <TaskSummaryAction onClick={openTask}>
                            {action.text}
                            &nbsp;
                            <Arrow />
                        </TaskSummaryAction>
                    )
                    : ''
                    }
				</TaskFooter>
			</TaskSummaryInner>
		</TaskSummaryWrapper>
	)
}
