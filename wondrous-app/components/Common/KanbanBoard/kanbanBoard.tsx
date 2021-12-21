import React, { useMemo, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import {
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
} from '../../../utils/constants'

import TaskColumn from './TaskColumn/taskColumn'
import { KanbanBoardContainer } from './styles'

const KanbanBoard = (props) => {
  const { tasksList } = props
  const [statusCards, setStatusCards] = useState(tasksList)

  const {
    [TASK_STATUS_TODO]: toDoCardsList,
    [TASK_STATUS_IN_PROGRESS]: inProgressCardsList,
    [TASK_STATUS_DONE]: doneCardsList,
  } = useMemo(() => {
    return (
      statusCards.reduce((acc, item) => {
        const { status } = item

        return ({
          ...acc,
          [status]: [...acc[status], item]
        })

      }, {
        [TASK_STATUS_TODO]: [],
        [TASK_STATUS_IN_PROGRESS]: [],
        [TASK_STATUS_DONE]: [],
      })
    )
  }, [statusCards])

  const handleMoveCard = (draggableItemId, columnStatus) => {
    setStatusCards((prevState) => (
      prevState.map((item) => {
        const { id } = item

        if (id === draggableItemId) {
          return ({
            ...item,
            status: columnStatus
          })
        }

        return item
      })
    ))
  }

  return (
    <KanbanBoardContainer>
      <DndProvider backend={HTML5Backend}>
        <TaskColumn
          cardsList={toDoCardsList}
          moveCard={handleMoveCard}
          status={TASK_STATUS_TODO}
        />
        <TaskColumn
          cardsList={inProgressCardsList}
          moveCard={handleMoveCard}
          status={TASK_STATUS_IN_PROGRESS}
        />
        <TaskColumn
          cardsList={doneCardsList}
          moveCard={handleMoveCard}
          status={TASK_STATUS_DONE}
        />
      </DndProvider>
    </KanbanBoardContainer>
  )
}

export default KanbanBoard