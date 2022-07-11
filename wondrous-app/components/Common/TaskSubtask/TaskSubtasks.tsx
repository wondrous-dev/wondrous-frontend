import styled from 'styled-components';
import TaskSubtaskHeader from './TaskSubtaskHeader';
import TaskSubtaskList from './TaskSubtaskList';

const TaskSubtaskWrapper = styled.div`
  width: 100%;
`;

export const TaskSubtasks = ({ taskId, canCreate }) => {
  if (!taskId) return null;
  return (
    <TaskSubtaskWrapper>
      <TaskSubtaskHeader taskId={taskId} canCreate={canCreate} />
      <TaskSubtaskList taskId={taskId} />
    </TaskSubtaskWrapper>
  );
};
