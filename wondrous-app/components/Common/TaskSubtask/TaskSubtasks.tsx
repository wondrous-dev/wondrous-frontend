import styled from 'styled-components';
import TaskSubtaskHeader from './TaskSubtaskHeader';
import TaskSubtaskList from './TaskSubtaskList';

const TaskSubtaskWrapper = styled.div`
  width: 100%;
`;

export const TaskSubtasks = ({ taskId, permissions, parentTask }) => {
  if (!taskId) return null;
  return (
    <TaskSubtaskWrapper>
      <TaskSubtaskHeader taskId={taskId} permissions={permissions} parentTask={parentTask} />
      <TaskSubtaskList taskId={taskId} />
    </TaskSubtaskWrapper>
  );
};
