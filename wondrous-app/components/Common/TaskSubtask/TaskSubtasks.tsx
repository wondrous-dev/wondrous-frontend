import { Done, InProgress, InReview, ToDo } from 'components/Icons';
import FilterStatusIcon from 'components/Icons/filterStatusIcon.svg';
import { ArchivedIcon } from 'components/Icons/statusIcons';
import { useState } from 'react';
import styled from 'styled-components';
import {
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_TODO,
} from 'utils/constants';
import TaskSubtaskFilter from './TaskSubtaskFilter';
import TaskSubtaskHeader from './TaskSubtaskHeader';
import TaskSubtaskList from './TaskSubtaskList';

export const TaskSubtaskFilterStatusIcon = styled(({ className }) => (
  <div className={className}>
    <FilterStatusIcon />
  </div>
))`
  && {
    background: #0f0f0f;
    height: 28px;
    width: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }
`;

export const TASK_ICONS_LABELS = {
  '': { Icon: TaskSubtaskFilterStatusIcon, label: 'All Tasks' },
  [TASK_STATUS_TODO]: { Icon: ToDo, label: 'To Do' },
  [TASK_STATUS_IN_PROGRESS]: { Icon: InProgress, label: 'In Progress' },
  [TASK_STATUS_IN_REVIEW]: { Icon: InReview, label: 'In Review' },
  [TASK_STATUS_DONE]: { Icon: Done, label: 'Completed' },
  [TASK_STATUS_ARCHIVED]: { Icon: ArchivedIcon, label: 'Archived' },
};

const TaskSubtaskWrapper = styled.div`
  width: 100%;
`;

export const TaskSubtasks = ({ taskId, canCreate }) => {
  const [status, setStatus] = useState('');
  if (!taskId) return null;
  return (
    <TaskSubtaskWrapper>
      <TaskSubtaskFilter status={status} setStatus={setStatus} />
      <TaskSubtaskHeader taskId={taskId} canCreate={canCreate} />
      <TaskSubtaskList taskId={taskId} status={status} />
    </TaskSubtaskWrapper>
  );
};
