import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_SUBTASKS_FOR_TASK, GET_SUBTASK_COUNT_FOR_TASK } from '../../../graphql/queries';
import { ENTITIES_TYPES, PERMISSIONS, TASK_STATUS_ARCHIVED } from '../../../utils/constants';
import CreateLayoutBaseModal from '../../CreateEntity/createEntityModal';
import { CreateModalOverlay } from '../../CreateEntity/styles';
import { CompletedIcon } from '../../Icons/statusIcons';
import { SubtaskLightIcon } from '../../Icons/subtask';
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

export const TaskSubtasks = ({ taskId, permissions }) => {
  const [createFormModal, setCreateFormModal] = useState(false);
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
  const canCreateSubtask =
    permissions.includes(PERMISSIONS.CREATE_TASK) || permissions.includes(PERMISSIONS.FULL_ACCESS);

  const toggleCreateFormModal = () => {
    setCreateFormModal((prevState) => !prevState);
  };

  return (
    <>
      <CreateModalOverlay open={createFormModal} onClose={toggleCreateFormModal}>
        <CreateLayoutBaseModal
          entityType={ENTITIES_TYPES.TASK}
          open={createFormModal}
          handleClose={toggleCreateFormModal}
          parentTaskId={taskId}
        />
      </CreateModalOverlay>
      <Subtask>
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
            <CreateSubtaskButton onClick={toggleCreateFormModal}>
              Create new subtask{' '}
              <CreateSubtaskIcon>
                <StyledPlusIcon fill="#ccbbff" />
              </CreateSubtaskIcon>
            </CreateSubtaskButton>
          )}
        </SubtaskHeader>
        {getSubtasksForTaskData?.getSubtasksForTask
          .filter((i) => i.status !== TASK_STATUS_ARCHIVED)
          .map((subtask) => (
            <SubtaskTask key={subtask.id} task={subtask} />
          ))}
      </Subtask>
    </>
  );
};
