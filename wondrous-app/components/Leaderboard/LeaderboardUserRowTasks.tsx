import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { useRouter } from 'next/router';
import palette from 'theme/palette';
import { PRIVATE_TASK_TITLE } from 'utils/constants';
import { cutString } from 'utils/helpers';
import useMediaQuery from 'hooks/useMediaQuery';

const LeaderboardUserRowTasks = ({ contributorTask }) => {
  const router = useRouter();
  const { isMobileScreen } = useMediaQuery();
  return (
    <Grid container item width="100%" borderRadius="0 0 6px 6px">
      <Grid container item width="100%" display="flex" gap="14px" padding="14px">
        {contributorTask?.tasks?.map((task) => {
          const podName = task?.podName || task?.pod?.name;
          const podColor = task?.podColor || task?.pod?.color || palette.grey78;
          const privateTask = task?.title === PRIVATE_TASK_TITLE;
          const handleOnClickTask = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!privateTask) {
              router.push({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  task: task.id,
                },
              });
            }
          };
          return (
            <Grid
              container
              item
              borderRadius="4px"
              padding="4px 8px"
              height="36px"
              alignItems="center"
              justifyContent="space-between"
              key={task?.id}
              sx={{
                cursor: !privateTask && 'pointer',
                '&:hover': {
                  backgroundColor: palette.grey87,
                },
              }}
              onClick={handleOnClickTask}
            >
              <Grid container item alignItems="center" gap="14px" width="fit-content">
                <Grid container item alignItems="center" justifyContent="center" width="fit-content">
                  <Typography color={palette.white} fontSize="15px" fontWeight="500">
                    {cutString(privateTask ? 'Private Task' : task.title)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item width="fit-content" gap="24px" alignItems="center">
                {podName && !isMobileScreen && (
                  <Grid container item gap="10px" width="fit-content" alignItems="center">
                    <Box
                      width="10px"
                      height="10px"
                      sx={{
                        borderRadius: '1000px',
                        background: podColor,
                        outline: `1px solid ${palette.grey87}`,
                      }}
                    />
                    <Typography fontSize="13px" fontWeight="500" color={palette.white}>
                      {podName}
                    </Typography>
                  </Grid>
                )}
                <Grid container item alignItems="center" width="fit-content" gap="6px">
                  <Typography color={palette.grey250} fontWeight="500" fontSize="13px">
                    {format(new Date(task?.completedAt), 'MMM dd')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      <Button
        sx={{
          backgroundColor: palette.grey85,
          borderRadius: '0 0 6px 6px',
          width: '100%',
          height: '40px',
          color: palette.grey250,
          fontWeight: 500,
          fontSize: 14,
          '&:hover': {
            backgroundColor: palette.grey78,
          },
        }}
        disableRipple
      >
        Show more
      </Button>
    </Grid>
  );
};

export default LeaderboardUserRowTasks;
