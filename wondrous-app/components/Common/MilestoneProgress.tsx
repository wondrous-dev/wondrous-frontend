import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ProgressBar from 'components/Common/ProgressBar';
import useGetMilestoneTasksProgress from 'hooks/useGetMilestoneTasksProgress';
import palette from 'theme/palette';

export function MilestoneProgress(props) {
  const { milestoneId } = props;
  const { tasksTotal, tasksCompleted, progress } = useGetMilestoneTasksProgress({ milestoneId });
  return (
    <Grid
      container
      flexDirection="column"
      bgcolor={palette.background.default}
      borderRadius="6px"
      padding="12px"
      gap="12px"
    >
      {tasksTotal ? (
        <>
          <Grid container item justifyContent="space-between" fontSize="13px" fontWeight="500" color={palette.grey58}>
            <div>Progress</div>
            <div>{progress}% complete</div>
          </Grid>
          <Grid item>
            <ProgressBar
              value={tasksCompleted}
              total={tasksTotal}
              height="12px"
              color={`linear-gradient(269.75deg, ${palette.green30} -19.96%, ${palette.green30} 11.33%, ${palette.violet90} 75.55%)`}
            />
          </Grid>
        </>
      ) : (
        <Typography color={palette.grey58} fontSize="13px" fontWeight="500">
          No tasks
        </Typography>
      )}
    </Grid>
  );
}

export function MilestoneProgressViewModal({ milestoneId, isMilestone }) {
  const { tasksTotal, tasksCompleted, progress } = useGetMilestoneTasksProgress({ milestoneId });
  if (!isMilestone) return null;
  return (
    <Grid
      bgcolor={palette.background.default}
      display="flex"
      flexGrow="1"
      height="26px"
      borderRadius="6px"
      gap="9px"
      padding="0 8px"
      alignItems="center"
    >
      <Typography
        display="flex"
        alignItems="center"
        fontFamily="Space Grotesk"
        fontSize="14px"
        fontWeight="700"
        width="fit-content"
        color={palette.white}
      >
        {progress}% complete
      </Typography>
      <Grid item flexGrow="1">
        <ProgressBar value={tasksCompleted} total={tasksTotal} />
      </Grid>
    </Grid>
  );
}
