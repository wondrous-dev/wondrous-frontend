import Grid from '@mui/material/Grid';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import palette from 'theme/palette';
import { GET_COMPLETED_TASK_LIST_BETWEEN_TIME_PERIOD } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { StyledCircularProgress } from 'components/Common/WonderAiTaskGeneration/styles';
import LeaderboardUserRowHeader from './LeaderboardUserRowHeader';

const LeaderboardUserRowTasks = dynamic(() => import('./LeaderboardUserRowTasks'), { ssr: false, suspense: false });

const LeaderboardUserRow = ({ contributorTask, position, toTime, fromTime, podId = null, orgId = null }) => {
  const [clicked, setClicked] = useState(false);
  const [
    getCompletedTaskListBetweenPeriods,
    { data: getContributorTasksData, loading: getContributorTaskLoading, fetchMore },
  ] = useLazyQuery(GET_COMPLETED_TASK_LIST_BETWEEN_TIME_PERIOD);
  useEffect(() => {
    if (clicked) {
      getCompletedTaskListBetweenPeriods({
        variables: {
          toTime,
          fromTime,
          includeBounties: true,
          limit: 10,
          offset: 0,
          ...(podId ? { podId } : { orgId }),
          assigneeId: contributorTask?.assigneeId,
        },
      });
    }
  }, [clicked]);

  const contributorTasks = getContributorTasksData?.getCompletedTaskListBetweenPeriods;
  const getMoreCompletedTaskListBetweenPeriod = useCallback(() => {
    fetchMore({
      variables: {
        offset: contributorTasks?.length,
        limit: 10,
      },
      updateQuery: (prev, { fetchMoreResult }) => ({
        getCompletedTaskListBetweenPeriods: [
          ...prev.getCompletedTaskListBetweenPeriods,
          ...fetchMoreResult.getCompletedTaskListBetweenPeriods,
        ],
      }),
    }).catch((error) => {
      console.log(error);
    });
  }, [contributorTasks, fetchMore]);

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
      />
      {getContributorTaskLoading && (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <StyledCircularProgress size={20} />
        </div>
      )}
      {clicked && (
        <LeaderboardUserRowTasks
          getMoreCompletedTaskListBetweenPeriod={getMoreCompletedTaskListBetweenPeriod}
          contributorTasks={contributorTasks || []}
        />
      )}
    </Grid>
  );
};

export default LeaderboardUserRow;
