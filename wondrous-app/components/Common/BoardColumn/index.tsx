import React from 'react'
import { Task } from '../../Common/Task'
import { Grey400 } from '../../../theme/colors'
import { BoardColumnWrapper, BoardColumnTitle, IconWrapper } from './styles'

export const BoardColumn = (props) => {
	const count = props.tasks.length
	const Icon = props.icon
	const iconStyle = {
		height: '24px',
		width: '24px',
		borderRadius: '24px',
		border: '1px solid ' + Grey400,
		padding: '3px',
	}

	return (
		<BoardColumnWrapper key={props.id + '-wrapper'}>
			<BoardColumnTitle>
				<IconWrapper>
					<Icon style={iconStyle} />
				</IconWrapper>
				<span style={{ display: 'flex', fontWeight: 'bold' }}>
					{' '}
					{props.title} {count}{' '}
				</span>
			</BoardColumnTitle>
			<div key={props.title + '-task-list'}>
				{props.tasks.map((task) => (
					<Task key={task.id} task={task} />
				))}
			</div>
		</BoardColumnWrapper>
	)
}
