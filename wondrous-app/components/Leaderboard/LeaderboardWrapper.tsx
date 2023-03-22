import { useQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD } from 'graphql/queries';
import { useEffect, useMemo, useState } from 'react';
import palette from 'theme/palette';

import { calculatePoints } from 'components/organization/analytics/PayoutModal';
import { StyledCircularProgress } from 'components/Common/WonderAiTaskGeneration/styles';
import { PRIVATE_TASK_TITLE } from 'utils/constants';
import { ExportCSVButton, ExportCSVButtonText } from 'components/organization/analytics/styles';
import LeaderboardDateTabs, { getStartDate } from './LeaderboardDateTabs';
import LeaderboardSearch from './LeaderboardSearch';
import LeaderboardUserRow from './LeaderboardUserRow';

const getContributorTaskData = (data, sortByPoints) => {
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
    if (sortByPoints) {
      if (calculatePoints(a?.tasks) > calculatePoints(b?.tasks)) {
        return -1;
      }
      if (calculatePoints(a?.tasks) < calculatePoints(b?.tasks)) {
        return 1;
      }
      return 0;
    }

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

const LeaderboardWrapper = ({ orgId = '', podId = '', orgData = null, podData = null }) => {
  const [assignee, setAssignee] = useState(null);
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const [toTime, setToTime] = useState(tomorrow);
  const [fromTime, setFromTime] = useState(getStartDate({ duration: 30, date: new Date() }));
  const [sortByPoints, setSortByPoints] = useState(false);
  const formatToTime = format(toTime, 'yyyy-MM-dd');
  const formatFromTime = format(fromTime, 'yyyy-MM-dd');
  const {
    data: getCompletedTasksBetweenPeriodsData,
    loading: getCompleteTasksLoading,
    refetch: refetchGetCompletedTasksBetweenPeriods,
  } = useQuery(GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD, {
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
  });

  useEffect(() => {
    if (!fromTime) {
      setFromTime(getStartDate({ duration: 30, date: new Date() }));
    }
  }, [fromTime]);

  const data = useMemo(
    () => getContributorTaskData(getCompletedTasksBetweenPeriodsData, sortByPoints),
    [getCompletedTasksBetweenPeriodsData, sortByPoints]
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
      <Grid container rowGap="14px" alignItems="center" justifyContent="space-between" width="100%">
        <LeaderboardDateTabs
          dateToday={tomorrow}
          setFromTime={setFromTime}
          setToTime={setToTime}
          fromTime={fromTime}
          toTime={toTime}
          contributorTaskData={data}
          orgId={orgData?.id || podData?.orgId}
          sortByPoints={sortByPoints}
          setSortByPoints={setSortByPoints}
          orgData={orgData}
          podData={podData}
        />
        <LeaderboardSearch
          assignee={assignee}
          setAssignee={setAssignee}
          orgId={orgId}
          podId={podId}
          handleGetCompletedTasksBetweenPeriods={handleGetCompletedTasksBetweenPeriods}
        />
      </Grid>
      {getCompleteTasksLoading ? (
        <StyledCircularProgress
          style={{
            marginTop: '24px',
            width: '24px',
            height: '24px',
          }}
        />
      ) : (
        <>
          {data?.length === 0 && (
            <Typography mt="40px" color={palette.white} fontWeight="500">
              Nothing found in this time period.
            </Typography>
          )}
          <Grid container flexDirection="column" gap="12px" marginTop="40px">
            {data?.map((contributorTask, index) => (
              <LeaderboardUserRow
                key={contributorTask?.assigneeId}
                position={index}
                contributorTask={contributorTask}
              />
            ))}
          </Grid>
        </>
      )}
    </>
  );
};

export default LeaderboardWrapper;
