import Grid from '@mui/material/Grid';
import DateRangePicker from 'components/DateRangePicker';
import useMediaQuery from 'hooks/useMediaQuery';
import { useState } from 'react';
import { format } from 'date-fns';
import { ExportCSVButton, ExportCSVButtonText } from 'components/organization/analytics/styles';
import { PRIVATE_TASK_TITLE } from 'utils/constants';
import { PayoutModal } from 'components/organization/analytics/PayoutModal';
import LeaderboardDateTabsButton from './LeaderboardDateTabsButton';

export const getStartDate = ({ duration, date }) => {
  const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - duration);
  return newDate;
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

const LeaderboardDateTabs = ({
  dateToday,
  setFromTime,
  setToTime,
  fromTime,
  toTime,
  contributorTaskData,
  orgId,
  setSortByPoints,
  sortByPoints,
  orgData = null,
  podData = null,
}) => {
  const { isTabletScreen } = useMediaQuery();
  const [payoutModal, setPayoutModal] = useState(false);
  const dateTabs = {
    allTime: {
      label: 'All time',
      fromTime: podData?.createdAt
        ? new Date(podData?.createdAt)
        : orgData?.createdAt
        ? new Date(orgData?.createdAt)
        : new Date(1900, 0, 1),
    },
    sevenDays: { label: '7 days', fromTime: getStartDate({ duration: 7, date: dateToday }) },
    thirtyDays: { label: '30 days', fromTime: getStartDate({ duration: 30, date: dateToday }) },
  };
  const [selected, setSelected] = useState(dateTabs.thirtyDays.label);
  const handleOnClick = ({ label, fromTime }) => {
    setSelected(label);
    setFromTime(fromTime);
    setToTime(dateToday);
  };
  const handleOnConfirm = (value) => {
    setFromTime(new Date(value.startDate));
    setToTime(new Date(value.endDate));
  };
  return (
    <Grid
      container
      alignItems="center"
      justifyContent={isTabletScreen ? 'space-between' : 'flex-start'}
      flexWrap="nowrap"
      width="fit-content"
      gap="14px"
      xs={12}
      md={9}
    >
      <PayoutModal
        open={payoutModal}
        handleClose={() => setPayoutModal(false)}
        orgId={orgId}
        fromTime={fromTime}
        toTime={toTime}
        contributorTaskData={contributorTaskData}
      />
      {Object.values(dateTabs).map(({ label, fromTime }) => (
        <LeaderboardDateTabsButton
          key={label}
          onClick={() => handleOnClick({ label, fromTime })}
          selected={selected === label}
        >
          {label}
        </LeaderboardDateTabsButton>
      ))}
      <DateRangePicker
        onConfirm={handleOnConfirm}
        blockPastDates={false}
        ButtonComponent={LeaderboardDateTabsButton}
        ButtonComponentOnClick={() => setSelected('custom')}
        ButtonComponentProps={{
          selected: selected === 'custom',
          children: 'Custom',
        }}
      />

      <LeaderboardDateTabsButton onClick={() => setSortByPoints(!sortByPoints)}>{`Sort by ${
        sortByPoints ? `tasks` : 'points'
      }`}</LeaderboardDateTabsButton>
      <div
        style={{
          flex: 1,
        }}
      />
      <LeaderboardDateTabsButton
        onClick={() =>
          exportContributorTaskCSV({
            contributorTaskData,
            fromTime,
            toTime,
            isPod: false,
          })
        }
      >
        Export work
      </LeaderboardDateTabsButton>
      <LeaderboardDateTabsButton onClick={() => setPayoutModal(true)}>Pay out work</LeaderboardDateTabsButton>
      <div
        style={{
          width: '4px',
        }}
      />
    </Grid>
  );
};

export default LeaderboardDateTabs;
