import Grid from '@mui/material/Grid';
import DateRangePicker from 'components/DateRangePicker';
import useMediaQuery from 'hooks/useMediaQuery';
import { useState } from 'react';

import LeaderboardDateTabsButton from './LeaderboardDateTabsButton';

const getStartDate = ({ duration, date }) => {
  const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - duration);
  return newDate;
};

const LeaderboardDateTabs = ({ dateToday, setFromTime, setToTime }) => {
  const { isTabletScreen } = useMediaQuery();
  const dateTabs = {
    allTime: { label: 'All time', fromTime: new Date(1900, 0, 1) },
    sevenDays: { label: '7 days', fromTime: getStartDate({ duration: 7, date: dateToday }) },
    thirtyDays: { label: '30 days', fromTime: getStartDate({ duration: 30, date: dateToday }) },
  };
  const [selected, setSelected] = useState(dateTabs.allTime.label);
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
      md={7}
    >
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
    </Grid>
  );
};

export default LeaderboardDateTabs;
