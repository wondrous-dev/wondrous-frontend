import { useQuery } from '@apollo/client';
import { GET_SUBTASKS_FOR_TASK, GET_SUBTASK_COUNT_FOR_TASK } from '../../../graphql/queries';
import { CompletedIcon } from '../../Icons/statusIcons';
import { SubTaskIcon } from '../../Icons/subTask';
import {
  CreateSubtaskButton,
  CreateSubtaskIcon,
  Label,
  LabelWrapper,
  StyledPlusIcon,
  Subtask,
  SubtaskCompletedWrapper,
  SubtaskHeader,
  SubtaskTask,
} from './styles';
import { TASK_STATUS_ARCHIVED } from '../../../utils/constants';

export const TaskSubtasks = ({ taskId }) => {
  const { data: getSubtaskCountForTaskData } = useQuery(GET_SUBTASK_COUNT_FOR_TASK, {
    variables: {
      taskId,
    },
  });
  const { data: getSubtasksForTaskData } = useQuery(GET_SUBTASKS_FOR_TASK, {
    variables: {
      taskId,
    },
  });

  return (
    <Subtask>
      <SubtaskHeader>
        <SubtaskCompletedWrapper>
          <LabelWrapper>
            <SubTaskIcon />{' '}
            <Label>
              {getSubtaskCountForTaskData?.getSubtaskCountForTask.total} subtask
              {getSubtaskCountForTaskData?.getSubtaskCountForTask.total > 1 && 's'}
            </Label>
          </LabelWrapper>
          <LabelWrapper>
            <CompletedIcon /> <Label>{getSubtaskCountForTaskData?.getSubtaskCountForTask.completed} complete</Label>
          </LabelWrapper>
        </SubtaskCompletedWrapper>
        <CreateSubtaskButton>
          Create new subtask{' '}
          <CreateSubtaskIcon>
            <StyledPlusIcon fill="#ccbbff" />
          </CreateSubtaskIcon>
        </CreateSubtaskButton>
      </SubtaskHeader>
      {getSubtasksForTaskData?.getSubtasksForTask.map((subtask) => (
        <SubtaskTask key={subtask.id} task={subtask} />
      ))}
    </Subtask>
  );
};
