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

export const ColumnSection = ({ section, setSection }) => {
	const { icon = Requested, title = '', tasks = [], action = {} } = section
	const [isOpen, setIsOpen] = useState(false)
	const SectionIcon = icon
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
					<SectionCount>{count}</SectionCount>
				</SectionHeader>
				<SectionChevronContainer className={isOpen ? 'active' : ''}>
					<Chevron />
				</SectionChevronContainer>
			</SectionHeaderContainer>
			<SectionContainer in={isOpen}>
				{tasks.map((task) => (
					<TaskSummary
						key={task.id}
						task={task}
						setTask={setTask}
						action={action}
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
