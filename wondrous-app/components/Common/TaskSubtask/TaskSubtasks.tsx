import { Subtask } from './styles';
import TaskSubtaskHeader from './TaskSubtaskHeader';
import TaskSubtaskList from './TaskSubtaskList';

export const TaskSubtasks = ({ taskId, permissions, parentTask }) => {
  return (
    <>
      <Subtask>
        {taskId && <TaskSubtaskHeader taskId={taskId} permissions={permissions} parentTask={parentTask} />}
        {taskId && <TaskSubtaskList taskId={taskId} />}
      </Subtask>
    </>
  );
};
