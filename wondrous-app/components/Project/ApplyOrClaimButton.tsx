import { useMutation } from '@apollo/client';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useMe } from 'components/Auth/withAuth';
import { ButtonPrimary } from 'components/Common/button';
import { TaskApplicationButton } from 'components/Common/TaskApplication';
import { UPDATE_TASK_ASSIGNEE } from 'graphql/mutations';
import { GET_ORG_TASK_BOARD_TASKS } from 'graphql/queries';
import { useState } from 'react';
import { usePermissions } from 'utils/hooks';

const ApplyOrClaimButton = ({ task }) => {
  const user = useMe();
  const { canClaim, canApply } = usePermissions({ type: task?.type });
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);
  if (!canClaim && canApply) {
    return (
      <TaskApplicationButton
        setIsApplicationModalOpen={setIsApplicationModalOpen}
        task={task}
        canApply={canApply}
        Icon={() => null}
        style={{
          width: '82px',
        }}
      />
    );
  }
  if (task?.assigneeId) {
    return (
      <Grid
        container
        bgcolor="#343434"
        padding="0 14px"
        borderRadius="160px"
        alignItems="center"
        color="#06FFA5"
        fontWeight="500"
        width="fit-content"
      >
        Claimed
      </Grid>
    );
  }

  return (
    <ButtonPrimary
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        updateTaskAssignee({
          variables: {
            taskId: task?.id,
            assigneeId: user?.id,
          },
          refetchQueries: [GET_ORG_TASK_BOARD_TASKS],
        });
      }}
      style={{
        width: '82px',
      }}
    >
      <Typography color="#fff" fontWeight="500" fontSize="14px" padding="0 12px">
        Claim
      </Typography>
    </ButtonPrimary>
  );
};

export default ApplyOrClaimButton;
