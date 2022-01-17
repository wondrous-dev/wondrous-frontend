import React, { useState } from 'react'
import { TaskSummary } from '../TaskSummary'
import { Requested, Chevron } from '../../Icons/sections'

import {
  SectionWrapper,
  SectionHeaderContainer,
  SectionIconContainer,
  SectionHeader,
  SectionCount,
  SectionChevronContainer,
  SectionContainer,
} from './styles'
import { TaskSummaryFooter } from '../TaskSummary/styles'
import { useOrgBoard } from '../../../utils/hooks'
import {
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
} from '../../../utils/constants'

export const ColumnSection = ({ section, setSection }) => {
  const { icon = Requested, title = '', tasks = [], action = {} } = section
  const [isOpen, setIsOpen] = useState(false)
  const SectionIcon = icon
  const orgBoard = useOrgBoard()
  const taskCount = orgBoard?.taskCount
  const type = section?.filter?.taskType
  let number = 0
  switch (type) {
    case TASK_STATUS_REQUESTED:
      number = taskCount?.proposal || 0
      break
    case TASK_STATUS_IN_REVIEW:
      number = taskCount?.submission || 0
      break
    case TASK_STATUS_ARCHIVED:
      number = taskCount?.archived || 0
      break
    default:
      number = 0
      break
  }
  // TODO get counts for proposals
  const count = tasks.length

  const toggleSection = () => {
    setIsOpen(!isOpen)
  }

  const setTask = (task) => {
    tasks.filter((t) => t.id === task.id)[0] = task
    setSection(section)
  }

  return (
    <SectionWrapper>
      <SectionHeaderContainer onClick={toggleSection}>
        <SectionIconContainer>
          <SectionIcon active={isOpen} />
        </SectionIconContainer>
        <SectionHeader>
          {title}
          <SectionCount>{number}</SectionCount>
        </SectionHeader>
        <SectionChevronContainer className={isOpen ? 'active' : ''}>
          <Chevron />
        </SectionChevronContainer>
      </SectionHeaderContainer>
      <SectionContainer in={isOpen}>
        {tasks.slice(0, 2).map((task) => (
          <TaskSummary
            key={task.id}
            task={task}
            setTask={setTask}
            action={action}
            taskType={type}
          />
        ))}
        {tasks.length >= 2 ? (
          <TaskSummaryFooter>See more</TaskSummaryFooter>
        ) : (
          ''
        )}
      </SectionContainer>
    </SectionWrapper>
  )
}
