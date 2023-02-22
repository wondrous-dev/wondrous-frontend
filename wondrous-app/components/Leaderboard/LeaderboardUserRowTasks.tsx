import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PodIconName from 'components/Common/PodIconName';
import CalendarIcon from 'components/Icons/calendar';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import StarIcon from 'components/Icons/Sidebar/star.svg';
import format from 'date-fns/format';
import { useRouter } from 'next/router';
import palette from 'theme/palette';
import { BOUNTY_TYPE, PRIVATE_TASK_TITLE } from 'utils/constants';
import { cutString } from 'utils/helpers';

const LeaderboardUserRowTasks = ({ contributorTask }) => {
  const router = useRouter();
  return (
    <Grid
      container
      item
      width="100%"
      display="flex"
      borderRadius="0 0 6px 6px"
      padding="12px 8px"
      gap="20px"
      bgcolor={palette.grey940}
    >
      {contributorTask?.tasks?.map((task) => {
        const podName = task?.podName || task?.pod?.name;
        const podColor = task?.podColor || task?.podColor;
        const privateTask = task?.title === PRIVATE_TASK_TITLE;
        return (
          <Grid
            container
            item
            alignItems="center"
            justifyContent="space-between"
            key={task?.id}
            sx={{
              cursor: !privateTask && 'pointer',
            }}
            onClick={(e) => {
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
            }}
          >
            <Grid container item alignItems="center" gap="14px" width="fit-content">
              <Grid
                container
                item
                bgcolor={palette.grey87}
                width="22px"
                height="22px"
                borderRadius="4px"
                alignItems="center"
                justifyContent="center"
                sx={{
                  '& svg': {
                    path: {
                      stroke: palette.blue20,
                    },
                    rect: {
                      stroke: palette.blue20,
                    },
                  },
                }}
              >
                {task.type === BOUNTY_TYPE ? <StarIcon /> : <CheckBoxIcon />}
              </Grid>
              <Grid container item alignItems="center" justifyContent="center" width="fit-content">
                <Typography color={palette.white} fontSize="15px" fontWeight="500">
                  {cutString(privateTask ? 'Private Task' : task.title)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item width="fit-content" gap="12px" alignItems="center">
              {podName && <PodIconName color={podColor} name={podName} />}
              <Grid container item alignItems="center" width="fit-content" gap="6px">
                <CalendarIcon />
                <Typography color={palette.white} fontWeight="500" fontSize="15px">
                  {format(new Date(task?.completedAt), 'MMM dd')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default LeaderboardUserRowTasks;
