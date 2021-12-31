import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { KanbanBoardContainer } from './styles'
import TaskColumn from './TaskColumn/taskColumn'

const KanbanBoard = (props) => {
	const { columns } = props
	const [columnsState, setColumnsState] = useState(columns)

	const moveCard = (id, status) => {
		const updatedColumns = columnsState.map((column) => {
			if (column.status !== status) {
				return {
					...column,
					tasks: column.tasks.filter((task) => task.id !== id),
				}
			}
			const task = columnsState
				.map(({ tasks }) => tasks.find((task) => task.id === id))
				.filter((i) => i)[0]
			const updatedTask = { ...task, status }
			return {
				...column,
				tasks: [updatedTask, ...column.tasks],
			}
		})
		setColumnsState(updatedColumns)
	}

	return (
		<KanbanBoardContainer>
			<DndProvider backend={HTML5Backend}>
				{columnsState.map((column) => {
					const { status, section, tasks } = column
					return (
						<TaskColumn
							key={status}
							cardsList={tasks}
							moveCard={moveCard}
							status={status}
							section={section}
						/>
					)
				})}
			</DndProvider>
		</KanbanBoardContainer>
	)
}

export default KanbanBoard
