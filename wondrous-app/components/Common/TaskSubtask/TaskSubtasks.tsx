import { Subtask } from './styles';
import TaskSubtaskHeader from './TaskSubtaskHeader';
import TaskSubtaskList from './TaskSubtaskList';

export const TaskSubtasks = ({ taskId, permissions, parentTask }) => {
  if (!taskId) return null;
  return (
    <Subtask>
      <TaskSubtaskHeader taskId={taskId} permissions={permissions} parentTask={parentTask} />
      <TaskSubtaskList taskId={taskId} />
    </Subtask>
  );
};
