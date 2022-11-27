import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ButtonPrimary } from 'components/Common/button';
import { TaskApplicationButton } from 'components/Common/TaskApplication';
import { useState } from 'react';
import { usePermissions } from 'utils/hooks';

const ApplyOrClaimButton = ({ type, task }) => {
  const { canClaim, canApply } = usePermissions({ type });
  const [claimed, setClaimed] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
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
  if (claimed) {
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
        // updateTaskAssignee({
        //   variables: {
        //     taskId: id,
        //     assigneeId: user?.id,
        //   },
        //   onCompleted: (data) => null,
        // });
        setClaimed(true);
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
