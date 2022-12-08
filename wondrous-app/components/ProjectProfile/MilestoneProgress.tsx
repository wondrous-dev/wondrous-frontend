import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ProgressBar from 'components/Common/ProgressBar';
import useGetMilestoneTasksProgress from 'hooks/useGetMilestoneTasksProgress';
import palette from 'theme/palette';

const MilestoneProgress = ({ milestoneId }: { milestoneId: string }) => {
  const { tasksTotal, tasksCompleted, progress } = useGetMilestoneTasksProgress({ milestoneId });
  return (
    <Grid container alignItems="center" justifyContent="flex-end" width="160px" gap="6px">
      {tasksTotal ? (
        <>
          <Grid
            container
            item
            justifyContent="flex-end"
            fontSize="13px"
            fontWeight="500"
            color={palette.blue20}
            width="fit-content"
          >
            {progress}%
          </Grid>
          <Grid item container width="115px">
            <ProgressBar
              value={tasksCompleted}
              total={tasksTotal}
              height="8px"
              color={`linear-gradient(269.75deg, ${palette.green30} -19.96%, ${palette.green30} 11.33%, ${palette.violet90} 75.55%)`}
            />
          </Grid>
        </>
      ) : null}
    </Grid>
  );
};

export default MilestoneProgress;
