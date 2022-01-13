import React, { useRef } from 'react'
import { useDrop } from 'react-dnd'

import {
	TASK_STATUS_DONE,
	TASK_STATUS_IN_PROGRESS,
	TASK_STATUS_IN_REVIEW,
	TASK_STATUS_TODO,
} from '../../../../utils/constants'

import { ToDo, InProgress, Done } from '../../../Icons'
import DraggableCard, { ItemTypes } from './DraggableCard'
import { ColumnSection } from '../../ColumnSection'

import {
	TaskColumnContainer,
	TaskColumnContainerHeader,
	TaskColumnContainerHeaderTitle,
	TaskColumnContainerCount,
	DropMeHere,
	TaskColumnDropContainer,
} from './styles'
import { Task } from '../../Task'

import { DropZone } from '../../../Icons/dropZone'
import Milestone from '../../Milestone'

interface ITaskColumn {
	cardsList: Array<any>
	moveCard: any
	status: string
	section: Array<any>
}

const TITLES = {
	[TASK_STATUS_TODO]: 'To-do',
	[TASK_STATUS_IN_PROGRESS]: 'In-Progress',
	[TASK_STATUS_IN_REVIEW]: 'In-Review',
	[TASK_STATUS_DONE]: 'Done',
}

const HEADER_ICONS = {
	[TASK_STATUS_TODO]: ToDo,
	[TASK_STATUS_IN_PROGRESS]: InProgress,
	// [TASK_STATUS_IN_REVIEW]: InReview,
	[TASK_STATUS_DONE]: Done,
}

const ColumnDropZone = ({ status, moveCard, children }) => {
	const ref = useRef(null)
	const [{ isOver, canDrop }, drop] = useDrop({
		accept: ItemTypes.CARD,
		drop(item: any) {
			moveCard(item.id, status)
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop(),
		}),
	})
	drop(ref)
	return (
		<TaskColumnDropContainer ref={ref}>
			{isOver && (
				<DropMeHere>
					<DropZone />
					<p>Drag task here</p>
				</DropMeHere>
			)}
			{children}
		</TaskColumnDropContainer>
	)
}

const TaskColumn = (props: ITaskColumn) => {
	const { cardsList, moveCard, status, section } = props

	const HeaderIcon = HEADER_ICONS[status]

	return (
		<TaskColumnContainer>
			<TaskColumnContainerHeader>
				<HeaderIcon />
				<TaskColumnContainerHeaderTitle>
					{TITLES[status]}
				</TaskColumnContainerHeaderTitle>
				<TaskColumnContainerCount>{cardsList.length}</TaskColumnContainerCount>
			</TaskColumnContainerHeader>
			<ColumnSection section={section} setSection={() => {}} />

			{cardsList.map((card) => (
				<DraggableCard
					key={card.id}
					id={card.id}
					status={card.status}
					moveCard={moveCard}
				>
					{card.milestone ? (
						<Milestone>
							<Task task={card} setTask={() => {}} />
						</Milestone>
					) : (
						<Task task={card} setTask={() => {}} />
					)}
				</DraggableCard>
			))}
			{(
				<ColumnDropZone moveCard={moveCard} status={status}>
					<div style={{ width: '325px', height: '100%' }} />
				</ColumnDropZone>
			)}
		</TaskColumnContainer>
	)
}

export default TaskColumn
