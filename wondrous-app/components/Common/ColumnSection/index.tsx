import React, { useState } from 'react';
import { TaskSummary } from '../TaskSummary';
import { Requested, Chevron } from '../../Icons/sections';

import {
  SectionWrapper,
  SectionHeaderContainer,
  SectionIconContainer,
  SectionHeader,
  SectionCount,
  SectionChevronContainer,
  SectionContainer,
} from './styles';
import { TaskSummaryFooter } from '../TaskSummary/styles';
import { useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks';
import {
  ENTITIES_TYPES,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
} from '../../../utils/constants';
import { TaskListViewModal } from '../Task/modal';

let windowOffset;
export const ColumnSection = ({ section, setSection }) => {
  const { icon = Requested, title = '', tasks = [], action = {} } = section;
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const SectionIcon = icon;
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  const taskCount = board?.taskCount;
  const type = section?.filter?.taskType;
  let number = 0;
  switch (type) {
    case TASK_STATUS_REQUESTED:
      number = taskCount?.proposal || 0;
      break;
    case TASK_STATUS_IN_REVIEW:
      number = taskCount?.submission || 0;
      break;
    case TASK_STATUS_ARCHIVED:
      number = taskCount?.archived || 0;
      break;
    default:
      number = 0;
      break;
  }
  // TODO get counts for proposals
  const count = tasks.length;

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  const setTask = (task) => {
    tasks.filter((t) => t.id === task.id)[0] = task;
    setSection(section);
  };

  let entityType;
  if (orgBoard) {
    entityType = ENTITIES_TYPES.ORG;
  } else if (podBoard) {
    entityType = ENTITIES_TYPES.POD;
  } else if (userBoard) {
    entityType = ENTITIES_TYPES.USER;
  }
  const openModal = () => {
    // document.body.style.overflow = 'hidden'
    // document.body.scroll = false
    windowOffset = window.scrollY;
    document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
    setModalOpen(true);
  };
  return (
    <SectionWrapper>
      <TaskListViewModal
        taskType={type}
        entityType={entityType}
        orgId={orgBoard?.orgId}
        podId={podBoard?.podId}
        userId={userBoard?.loggedInUserId}
        open={modalOpen}
        handleClose={() => {
          document.body.setAttribute('style', '');
          window?.scrollTo(0, windowOffset);
          setModalOpen(false);
        }}
        count={number}
      />

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
          <TaskSummary key={task.id} task={task} setTask={setTask} action={action} taskType={type} />
        ))}
        {tasks.length >= 2 || number >= 2 ? <TaskSummaryFooter onClick={openModal}>See more</TaskSummaryFooter> : ''}
      </SectionContainer>
    </SectionWrapper>
  );
};
