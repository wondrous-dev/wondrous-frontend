import { useQuery } from '@apollo/client';
import { GET_SUBTASK_COUNT_FOR_TASK } from 'graphql/queries';
import { PERMISSIONS } from 'utils/constants';
import { CompletedIcon } from '../../Icons/statusIcons';
import { SubtaskLightIcon } from '../../Icons/subtask';
import {
  CreateSubtaskButton,
  CreateSubtaskIcon,
  Label,
  LabelWrapper,
  StyledPlusIcon,
  SubtaskCompletedWrapper,
  SubtaskHeader,
} from './styles';

export const TaskSubtaskHeader = ({ taskId, permissions, onClick }) => {
  const { data: getSubtaskCountForTaskData } = useQuery(GET_SUBTASK_COUNT_FOR_TASK, {
    variables: {
      taskId,
    },
  });
  const canCreateSubtask =
    permissions.includes(PERMISSIONS.CREATE_TASK) || permissions.includes(PERMISSIONS.FULL_ACCESS);

  return (
    <SubtaskHeader>
      <SubtaskCompletedWrapper>
        <LabelWrapper>
          <SubtaskLightIcon />{' '}
          <Label>
            {getSubtaskCountForTaskData?.getSubtaskCountForTask.total} subtask
            {getSubtaskCountForTaskData?.getSubtaskCountForTask.total > 1 && 's'}
          </Label>
        </LabelWrapper>
        <LabelWrapper>
          <CompletedIcon /> <Label>{getSubtaskCountForTaskData?.getSubtaskCountForTask.completed} complete</Label>
        </LabelWrapper>
      </SubtaskCompletedWrapper>
      {canCreateSubtask && (
        <CreateSubtaskButton onClick={() => onClick()}>
          Create new subtask{' '}
          <CreateSubtaskIcon>
            <StyledPlusIcon fill="#ccbbff" />
          </CreateSubtaskIcon>
        </CreateSubtaskButton>
      )}
    </SubtaskHeader>
  );
};
