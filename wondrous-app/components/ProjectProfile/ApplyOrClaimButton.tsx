import { useMutation } from '@apollo/client';
import Typography from '@mui/material/Typography';
import { useMe } from 'components/Auth/withAuth';
import { ButtonPrimary } from 'components/Common/button';
import { TaskApplicationButton } from 'components/Common/TaskApplication';
import { UPDATE_TASK_ASSIGNEE } from 'graphql/mutations';
import { GET_ORG_TASK_BOARD_TASKS, GET_POD_TASK_BOARD_TASKS } from 'graphql/queries';
import { useState } from 'react';
import palette from 'theme/palette';
import { TASK_STATUS_DONE } from 'utils/constants';
import { usePermissions } from 'utils/hooks';

const ApplyOrClaimButton = ({ task }) => {
  const user = useMe();
  const { canClaim, canApply } = usePermissions(task);
  const [claimed, setClaimed] = useState(false);
  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);
  const handleClaim = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setClaimed(true);
    updateTaskAssignee({
      variables: {
        taskId: task?.id,
        assigneeId: user?.id,
      },
      refetchQueries: [GET_ORG_TASK_BOARD_TASKS, GET_POD_TASK_BOARD_TASKS],
    });
  };
  if (task.status === TASK_STATUS_DONE) return null;
  if (!canClaim && canApply) {
    return (
      <TaskApplicationButton
        task={task}
        canApply={canApply}
        Icon={() => null}
        style={{
          width: '82px',
        }}
      />
    );
  }

  if (!claimed && canClaim) {
    return (
      <ButtonPrimary
        onClick={handleClaim}
        style={{
          width: '82px',
        }}
      >
        <Typography color={palette.white} fontWeight="500" fontSize="14px" padding="0 12px">
          Claim
        </Typography>
      </ButtonPrimary>
    );
  }

  return null;
};

export default ApplyOrClaimButton;
