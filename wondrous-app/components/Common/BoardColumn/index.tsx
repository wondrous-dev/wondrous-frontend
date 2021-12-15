import React, { useEffect, useState } from 'react'
import { Task } from '../../Common/Task'
import { ToDo } from '../../Icons'
import { ColumnSection } from '../ColumnSection'
import { Grey400 } from '../../../theme/colors'
import { BoardColumnWrapper, BoardColumnTitle, IconWrapper } from './styles'

export const BoardColumn = ({ column, setColumn }) => {
	
	const { sections = [], tasks = [], icon = ToDo,title = '',  } = column

	const count = tasks.length
	const Icon = icon
	const iconStyle = {
		height: '24px',
		width: '24px',
		borderRadius: '24px',
		border: '1px solid ' + Grey400,
		padding: '3px',
	}

	const setTask = (task) => {
		tasks.filter((t) => t.id === task.id)[0] = task
		setColumn(column)
	}

	const setSection = (section) => {
		sections.filter((s) => s.id === section.id)[0] = section
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
					{title} {count}{' '}
				</span>
			</BoardColumnTitle>
			{
				sections.map((section) => (
					<ColumnSection key={section.id} section={section} setSection={setSection}/>
				))
			}
			<div key={title + '-task-list'}>
				{tasks.map((task) => (
					<Task key={task.id} task={task} setTask={setTask} />
				))}
			</div>
		</BoardColumnWrapper>
	)
}
