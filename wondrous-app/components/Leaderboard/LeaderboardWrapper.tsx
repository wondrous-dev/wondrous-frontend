import { useQuery } from '@apollo/client';
import { Grid } from '@mui/material';
import { HeaderText } from 'components/organization/wrapper/styles';
import { format } from 'date-fns';
import { GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD } from 'graphql/queries';
import { useMemo, useState } from 'react';
import { BOUNTY_TYPE, PRIVATE_TASK_TITLE, TASK_TYPE } from 'utils/constants';

import LeaderboardDateTabs from './LeaderboardDateTabs';
import LeaderboardSearch from './LeaderboardSearch';
import LeaderboardUserRow from './LeaderboardUserRow';

const getContributorTaskData = (data) => {
  const completedTaskData = data?.getCompletedTasksBetweenPeriods;
  const preFilteredcontributorTaskData = completedTaskData ? [...completedTaskData] : [];
  const noAssigneeIndex = preFilteredcontributorTaskData?.findIndex((element) => !element?.assigneeId);
  const tmp = preFilteredcontributorTaskData[noAssigneeIndex];
  if (tmp) {
    preFilteredcontributorTaskData[noAssigneeIndex] =
      preFilteredcontributorTaskData[preFilteredcontributorTaskData?.length - 1];
    preFilteredcontributorTaskData[preFilteredcontributorTaskData?.length - 1] = tmp;
  }

  let contributorTaskData = tmp
    ? preFilteredcontributorTaskData.slice(0, preFilteredcontributorTaskData?.length - 1)
    : preFilteredcontributorTaskData;
  contributorTaskData.sort((a, b) => {
    if (a?.tasks?.length > b?.tasks?.length) {
      return -1;
    }
    if (a?.tasks?.length < b?.tasks?.length) {
      return 1;
    }
    return 0;
  });

  if (tmp) {
    contributorTaskData = [...contributorTaskData, tmp];
  }
  return contributorTaskData;
};

const LeaderboardWrapper = ({ orgId = '', podId = '' }) => {
  const [assignee, setAssignee] = useState(null);
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const lastTwoWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
  const [toTime, setToTime] = useState(tomorrow);
  const [fromTime, setFromTime] = useState(lastTwoWeek);
  const formatToTime = format(toTime, 'yyyy-MM-dd');
  const formatFromTime = format(fromTime, 'yyyy-MM-dd');
  const { data: getCompletedTasksBetweenPeriodsData, refetch: refetchGetCompletedTasksBetweenPeriods } = useQuery(
    GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD,
    {
      fetchPolicy: 'cache-and-network',
      skip: !((podId || orgId) && fromTime && toTime),
      variables: {
        toTime: formatToTime,
        fromTime: formatFromTime,
        includeBounties: true,
        ...(podId ? { podId } : { orgId }),
        ...(assignee && {
          assigneeId: assignee?.value,
        }),
      },
    }
  );

  const data = useMemo(
    () => getContributorTaskData(getCompletedTasksBetweenPeriodsData),
    [getCompletedTasksBetweenPeriodsData]
  );

  const handleGetCompletedTasksBetweenPeriods = () =>
    refetchGetCompletedTasksBetweenPeriods({
      toTime: formatToTime,
      fromTime: formatFromTime,
      ...(assignee && {
        assigneeId: assignee?.value,
      }),
    });

  return (
    <>
      <Grid container rowGap="14px" alignItems="center" justifyContent="space-between" width="100%" marginBottom="14px">
        <LeaderboardDateTabs dateToday={today} setFromTime={setFromTime} />
        <LeaderboardSearch
          assignee={assignee}
          setAssignee={setAssignee}
          orgId={orgId}
          podId={podId}
          handleGetCompletedTasksBetweenPeriods={handleGetCompletedTasksBetweenPeriods}
        />
      </Grid>
      {data?.length === 0 && (
        <HeaderText
          style={{
            fontWeight: 'normal',
          }}
        >
          Nothing found in this time period.
        </HeaderText>
      )}
      <Grid container flexDirection="column" gap="12px">
        {data?.map((contributorTask, index) => (
          <LeaderboardUserRow key={contributorTask?.assigneeId} position={index} contributorTask={contributorTask} />
        ))}
      </Grid>
    </>
  );
};

export default LeaderboardWrapper;
