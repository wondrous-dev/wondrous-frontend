import React from "react";

import {
  TASK_STATUS_DONE,
  TASK_STATUS_INPROGRESS,
  TASK_STATUS_INREVIEW,
  TASK_STATUS_TODO,
} from "../../../../utils/constants";

import PlusIcon from "../../../Icons/plus";
import { ToDo, InProgress, Done } from "../../../Icons";
import TaskCard, {ITaskCard} from "../TaskCard/taskCard";
import DraggableCard from "../TaskCard/DraggableCard";

import {
  TaskColumnContainer,
  TaskColumnContainerHeader,
  TaskColumnContainerHeaderTitle,
  TaskColumnContainerHeaderPlusButton,
} from './styles'

interface ITaskColumn {
  cardsList: Array<ITaskCard>
  moveCard: any
  status: string
}

const TITLES = {
  [TASK_STATUS_TODO]: 'To-do',
  [TASK_STATUS_INPROGRESS]: 'In-Progress',
  [TASK_STATUS_INREVIEW]: 'In-Review',
  [TASK_STATUS_DONE]: 'Done',
}

const HEADER_ICONS = {
  [TASK_STATUS_TODO]: ToDo,
  [TASK_STATUS_INPROGRESS]: InProgress,
  // [TASK_STATUS_INREVIEW]: InReview,
  [TASK_STATUS_DONE]: Done,
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
      {cardsList.map((card: ITaskCard) => (
        <DraggableCard
          key={card.id}
          id={card.id}
          status={card.status}
          moveCard={moveCard}
        >
          <TaskCard {...card} />
        </DraggableCard>
      ))}
    </TaskColumnContainer>
  )
}

export default TaskColumn