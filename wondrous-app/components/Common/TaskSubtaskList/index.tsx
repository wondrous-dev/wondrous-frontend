import { useQuery } from '@apollo/client';
import { GET_SUBTASKS_FOR_TASK } from '../../../graphql/queries';
import { TASK_STATUS_ARCHIVED } from '../../../utils/constants';
import { SubtaskTaskItem } from './styles';

export const TaskSubtaskList = ({ taskId }) => {
  const { data: getSubtasksForTaskData } = useQuery(GET_SUBTASKS_FOR_TASK, {
    variables: {
      taskId,
    },
  });
  return (
    <>
      {getSubtasksForTaskData?.getSubtasksForTask
        .filter((i) => i.status !== TASK_STATUS_ARCHIVED)
        .map((subtask) => (
          <SubtaskTaskItem key={subtask.id} task={subtask} />
        ))}
    </>
  );
};
