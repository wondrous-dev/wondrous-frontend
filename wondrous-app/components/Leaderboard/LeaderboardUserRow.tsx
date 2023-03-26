import Grid from '@mui/material/Grid';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import palette from 'theme/palette';
import { GET_COMPLETED_TASK_LIST_BETWEEN_TIME_PERIOD, GET_USD_PAYOUT_BETWEEN_TIME_PERIOD } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { StyledCircularProgress } from 'components/Common/WonderAiTaskGeneration/styles';
import LeaderboardUserRowHeader from './LeaderboardUserRowHeader';

const LeaderboardUserRowTasks = dynamic(() => import('./LeaderboardUserRowTasks'), { ssr: false, suspense: false });

const LeaderboardUserRow = ({ contributorTask, position, toTime, fromTime, podId = null, orgId = null }) => {
  const [clicked, setClicked] = useState(false);
  const [getCompletedTaskListBetweenPeriods, { data: getContributorTasksData, loading: getContributorTaskLoading }] =
    useLazyQuery(GET_COMPLETED_TASK_LIST_BETWEEN_TIME_PERIOD);
  const [getUsdPayout, { data: getUsdPayoutData }] = useLazyQuery(GET_USD_PAYOUT_BETWEEN_TIME_PERIOD);
  useEffect(() => {
    if (clicked) {
      getCompletedTaskListBetweenPeriods({
        variables: {
          toTime,
          fromTime,
          includeBounties: true,
          ...(podId ? { podId } : { orgId }),
          assigneeId: contributorTask?.assigneeId,
        },
      });
    }
  }, [clicked]);

  useEffect(() => {
    if (toTime && fromTime && contributorTask?.assigneeId)
      getUsdPayout({
        variables: {
          toTime,
          fromTime,
          includeBounties: true,
          ...(podId ? { podId } : { orgId }),
          assigneeId: contributorTask?.assigneeId,
        },
      });
  }, [toTime, fromTime, contributorTask?.assigneeId]);

  const contributorTasks = getContributorTasksData?.getCompletedTaskListBetweenPeriods;
  const usdPayout = getUsdPayoutData?.getUsdPayoutForLeaderBoard?.usdPayout;

  return (
    <Grid
      container
      bgcolor={clicked ? palette.grey900 : palette.grey910}
      border={`1px solid ${clicked ? palette.grey85 : 'transparent'}`}
      borderRadius="6px"
      minHeight="44px"
      sx={{
        '&:hover': {
          bgcolor: palette.grey900,
          border: `1px solid ${palette.grey85}`,
        },
      }}
    >
      <LeaderboardUserRowHeader
        contributorTask={contributorTask}
        position={position}
        clicked={clicked}
        setClicked={setClicked}
        usdPayout={usdPayout}
      />
      {getContributorTaskLoading && (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <StyledCircularProgress size={20} />
        </div>
      )}
      {clicked && <LeaderboardUserRowTasks contributorTasks={contributorTasks || []} />}
    </Grid>
  );
};

export default LeaderboardUserRow;
