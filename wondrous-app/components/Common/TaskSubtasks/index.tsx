import { useQuery } from '@apollo/client';
import { GET_SUBTASK_COUNT_FOR_TASK } from '../../../graphql/queries';
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
} from './styles';

export const TaskSubtasks = ({ taskId }) => {
  const { data } = useQuery(GET_SUBTASK_COUNT_FOR_TASK, {
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
              {data?.getSubtaskCountForTask.total} subtask{data?.getSubtaskCountForTask.total > 1 && 's'}
            </Label>
          </LabelWrapper>
          <LabelWrapper>
            <CompletedIcon /> <Label>{data?.getSubtaskCountForTask.completed} complete</Label>
          </LabelWrapper>
        </SubtaskCompletedWrapper>
        <CreateSubtaskButton>
          Create new subtask{' '}
          <CreateSubtaskIcon>
            <StyledPlusIcon fill="#ccbbff" />
          </CreateSubtaskIcon>
        </CreateSubtaskButton>
      </SubtaskHeader>
    </Subtask>
  );
};
