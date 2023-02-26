import { useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { format } from 'date-fns';
import { GET_AUTOCOMPLETE_USERS, GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD, SEARCH_ORG_USERS } from 'graphql/queries';
import palette from 'theme/palette';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import BottomArrowCaret from 'components/Icons/BottomArrowCaret';
import RightArrowCaret from 'components/Icons/RightArrowCaret';
import TaskViewModal from 'components/Common/TaskViewModal';
import { Reward, RewardAmount, RewardContainer, TaskTitle } from 'components/Table/styles';
import { BountySignifier } from 'components/Common/Task/styles';
import PodIconName from 'components/Common/PodIconName';
import { cutString, shrinkNumber } from 'utils/helpers';
import TaskStatus from 'components/Icons/TaskStatus';
import { Grid, TextField } from '@mui/material';
import { OptionDiv, OptionTypography, StyledAutocompletePopper, StyledChip } from 'components/CreateEntity/styles';
import { BOUNTY_TYPE, PRIVATE_TASK_TITLE, TASK_TYPE } from 'utils/constants';
import BoardPageHeader from 'components/organization/wrapper/BoardPageHeader';
import LeaderboardSearch from 'components/Leaderboard/LeaderboardSearch';
import LeaderboardDateTabs from 'components/Leaderboard/LeaderboardDateTabs';
import LeaderboardUserRow from 'components/Leaderboard/LeaderboardUserRow';

import { PayoutModal } from './PayoutModal';
import {
  ContributorRow,
  ContributorDiv,
  ContributorRowText,
  HeaderText,
  HeaderWrapper,
  SelectDatePicker,
  StyledTextField,
  TaskCountText,
  TaskCountWrapper,
  TasksWrapper,
  TaskRow,
  ExportCSVButton,
  ExportCSVButtonText,
} from './styles';

export const filterOrgUsers = (orgUsers) => {
  if (!orgUsers) {
    return [];
  }

  return orgUsers?.map((orgUser) => ({
    profilePicture: orgUser?.user?.thumbnailPicture || orgUser?.user?.profilePicture,
    label: orgUser?.user?.username,
    value: orgUser?.user?.id,
  }));
};

export const exportContributorTaskCSV = ({ contributorTaskData, fromTime, toTime, isPod = false }) => {
  const headers = [
    'username',
    'Address/ENS',
    'taskTitle',
    'taskLink',
    'points',
    'Amount',
    'Token Address/Token Symbol',
  ];

  const rows = [[headers]];
  if (!contributorTaskData) {
    return;
  }
  contributorTaskData.forEach((contributorTask) => {
    const assigneeUsername = contributorTask?.assigneeUsername || '';
    const wallet = contributorTask?.assigneeWallet;
    const tasks = contributorTask?.tasks;
    tasks?.forEach((task) => {
      const link = process.env.NEXT_PUBLIC_PRODUCTION
        ? `https://app.wonderverse.xyz/invite/`
        : 'https://wondrous-app-git-staging-wonderverse.vercel.app/invite/';
      const finalLink = isPod
        ? `${link}pod/${task?.pod?.id}/boards?task=${task?.id}`
        : `${link}organization/${task?.org?.username}/boards?task=${task?.id}`;
      const reward = (task.rewards || [])[0];
      const newRow = [
        assigneeUsername,
        wallet,
        task?.title === PRIVATE_TASK_TITLE ? 'Private Task' : task?.title,
        finalLink,
        task?.points || '',
        reward ? reward?.rewardAmount : '',
        reward ? reward?.symbol : '',
      ];
      rows.push(newRow);
    });
  });
  let csvContent = 'data:text/csv;charset=utf-8,';
  rows.forEach((rowArray) => {
    const row = rowArray.join(',');
    csvContent += `${row}\r\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `wonderverse_contributor_data_${format(new Date(fromTime), 'MM/dd/yyyy')}_to_${format(
      new Date(toTime),
      'MM/dd/yyyy'
    )}.csv`
  );
  document.body.appendChild(link); // Required for FF
  link.click();
};
export const UserRowPictureStyles = {
  width: '30px',
  height: '30px',
  borderRadius: '15px',
  marginRight: '8px',
};

const CaretStyle = {
  marginRight: '12px',
};

export const calculatePoints = (tasks) => {
  let points = 0;
  if (!tasks) {
    return points;
  }
  tasks.forEach((task) => {
    if (task?.points) {
      points += Number(task?.points);
    }
  });
  return points;
};

export const calculateCount = (tasks) => {
  let taskCount = 0;
  let bountyCount = 0;
  if (!tasks)
    return {
      taskCount,
      bountyCount,
    };

  tasks.forEach((task) => {
    if (task?.type === BOUNTY_TYPE) {
      bountyCount += 1;
    } else if (task?.type === TASK_TYPE) {
      taskCount += 1;
    }
  });
  return {
    taskCount,
    bountyCount,
  };
};

export const filterUsers = (users) => {
  if (!users) {
    return [];
  }

  return users.map((user) => ({
    profilePicture: user?.thumbnailPicture || user?.profilePicture,
    label: user?.username,
    value: user?.id,
  }));
};

export const getContributorTaskData = (data) => {
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

function Analytics(props) {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  const [assignee, setAssignee] = useState(null);
  const [payoutModal, setPayoutModal] = useState(false);

  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const lastTwoWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
  const [toTime, setToTime] = useState(tomorrow);
  const [fromTime, setFromTime] = useState(lastTwoWeek);
  const formatToTime = format(toTime, 'yyyy-MM-dd');
  const formatFromTime = format(fromTime, 'yyyy-MM-dd');
  const { data: completedTaskData, refetch: getCompletedTasksBetweenPeriods } = useQuery(
    GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD,
    {
      fetchPolicy: 'cache-and-network',
      skip: !(orgId && fromTime && toTime),
      variables: {
        orgId,
        toTime: formatToTime,
        fromTime: formatFromTime,
        includeBounties: true,
        ...(assignee && {
          assigneeId: assignee?.value,
        }),
      },
    }
  );

  const handleGetCompletedTasksBetweenPeriods = () =>
    getCompletedTasksBetweenPeriods({
      toTime: formatToTime,
      fromTime: formatFromTime,
      ...(assignee && {
        assigneeId: assignee?.value,
      }),
    });

  const contributorTaskData = useMemo(() => getContributorTaskData(completedTaskData), [completedTaskData]);

  return (
    <BoardPageHeader orgData={orgData} headerTitle="Analytics">
      <PayoutModal
        open={payoutModal}
        handleClose={() => setPayoutModal(false)}
        orgId={orgId}
        fromTime={fromTime}
        toTime={toTime}
        contributorTaskData={contributorTaskData}
      />
      <Grid container rowGap="14px" alignItems="center" justifyContent="space-between" width="100%" marginBottom="14px">
        {/* <HeaderText>Completed work from</HeaderText> */}
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
        {/*   <SelectDatePicker */}
        {/*     title="Due date" */}
        {/*     inputFormat="MM/dd/yyyy" */}
        {/*     value={fromTime} */}
        {/*     onChange={(value) => setFromTime(value)} */}
        {/*     renderInput={(params) => <StyledTextField {...params} />} */}
        {/*   /> */}
        {/* </LocalizationProvider> */}
        {/* <HeaderText>to</HeaderText> */}
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
        {/*   <SelectDatePicker */}
        {/*     title="Due date" */}
        {/*     inputFormat="MM/dd/yyyy" */}
        {/*     value={toTime} */}
        {/*     onChange={(value) => setToTime(value)} */}
        {/*     renderInput={(params) => <StyledTextField {...params} />} */}
        {/*   /> */}
        {/* </LocalizationProvider> */}
        {/* <HeaderText>by</HeaderText> */}
        <LeaderboardDateTabs dateToday={today} setFromTime={setFromTime} />
        <LeaderboardSearch
          assignee={assignee}
          setAssignee={setAssignee}
          orgId={orgId}
          handleGetCompletedTasksBetweenPeriods={handleGetCompletedTasksBetweenPeriods}
        />
      </Grid>
      {contributorTaskData?.length === 0 && (
        <HeaderText
          style={{
            fontWeight: 'normal',
          }}
        >
          Nothing found in this time period.
        </HeaderText>
      )}
      <Grid container flexDirection="column" gap="12px">
        {contributorTaskData?.map((contributorTask, index) => (
          <LeaderboardUserRow key={contributorTask?.assigneeId} position={index} contributorTask={contributorTask} />
        ))}{' '}
      </Grid>
    </BoardPageHeader>
  );
}

export default Analytics;
