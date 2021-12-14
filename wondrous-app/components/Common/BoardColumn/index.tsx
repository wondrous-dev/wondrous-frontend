import React, { useEffect, useState } from 'react'
import { Task } from '../../Common/Task'
import { Grey400 } from '../../../theme/colors'
import { BoardColumnWrapper, BoardColumnTitle, IconWrapper } from './styles'

export const BoardColumn = ({ column, setColumn }) => {
	const count = column.tasks.length
	const Icon = column.icon
	const iconStyle = {
		height: '24px',
		width: '24px',
		borderRadius: '24px',
		border: '1px solid ' + Grey400,
		padding: '3px',
	}

	const setTask = (task) => {
		column.tasks.filter((t) => t.id === task.id)[0] = task
		setColumn(column)
	}

	useEffect(() => {
		setColumn(column)
	}, [setColumn, column])

	return (
		<BoardColumnWrapper key={column.id + '-wrapper'}>
			<BoardColumnTitle>
				<IconWrapper>
					<Icon style={iconStyle} />
				</IconWrapper>
				<span style={{ display: 'flex', fontWeight: 'bold' }}>
					{' '}
					{column.title} {count}{' '}
				</span>
			</BoardColumnTitle>
			<div key={column.title + '-task-list'}>
				{column.tasks.map((task) => (
					<Task key={task.id} task={task} setTask={setTask} />
				))}
			</div>
		</BoardColumnWrapper>
	)
}
