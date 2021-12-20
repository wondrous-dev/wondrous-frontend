import React, {useRef} from 'react'
import {useDrop} from 'react-dnd'

import {
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_TODO,
} from '../../../../utils/constants'

import PlusIcon from '../../../Icons/plus'
import { ToDo, InProgress, Done } from '../../../Icons'
import TaskCard from '../TaskCard/taskCard'
import DraggableCard, {ItemTypes} from '../TaskCard/DraggableCard'

import {
  TaskColumnContainer,
  TaskColumnContainerHeader,
  TaskColumnContainerHeaderTitle,
  TaskColumnContainerHeaderPlusButton,
} from './styles'

interface ITaskColumn {
  cardsList: Array<any>
  moveCard: any
  status: string
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
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop(item: any) {
      moveCard(item.id, status)
    }
  })
  drop(ref)
  return (
    <div ref={ref}>{children}</div>
  )
}

const TaskColumn = (props: ITaskColumn) => {
  const {
    cardsList,
    moveCard,
    status,
  } = props

  const HeaderIcon = HEADER_ICONS[status]

  return (
    <TaskColumnContainer>
      <TaskColumnContainerHeader>
        <HeaderIcon />
        <TaskColumnContainerHeaderTitle>
          {TITLES[status]}
        </TaskColumnContainerHeaderTitle>
        <TaskColumnContainerHeaderPlusButton>
          <PlusIcon />
        </TaskColumnContainerHeaderPlusButton>
      </TaskColumnContainerHeader>
      {cardsList.map((card) => (
        <DraggableCard
          key={card.id}
          id={card.id}
          status={card.status}
          moveCard={moveCard}
        >
          <TaskCard {...card} />
        </DraggableCard>
      ))}
      {!cardsList.length && (
        <ColumnDropZone
          moveCard={moveCard}
          status={status}
        >
          <div style={{ width: '325px', height: '200px'}} />
        </ColumnDropZone>
      )}
    </TaskColumnContainer>
  )
}

export default TaskColumn