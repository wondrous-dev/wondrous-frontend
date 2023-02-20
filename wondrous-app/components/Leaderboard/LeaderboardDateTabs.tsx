import Grid from '@mui/material/Grid';
import { useState } from 'react';

import LeaderBoardDateTabsButton from './LeaderboardDateTabsButton';

const getStartDate = ({ duration, date }) => {
  const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - duration);
  return newDate;
};

const LeaderboardDateTabs = ({ dateToday, setFromTime }) => {
  const dateTabs = {
    allTime: { label: 'All time', fromTime: new Date(2021, 0, 1) },
    sevenDays: { label: '7 days', fromTime: getStartDate({ duration: 7, date: dateToday }) },
    thirtyDays: { label: '30 days', fromTime: getStartDate({ duration: 30, date: dateToday }) },
    // custom: 'Custom',
  };
  const [selected, setSelected] = useState(dateTabs.allTime.label);
  const handleOnClick = ({ label, fromTime }) => {
    setSelected(label);
    setFromTime(fromTime);
  };
  return (
    <Grid container alignItems="center" width="100%" gap="14px">
      {Object.values(dateTabs).map(({ label, fromTime }) => (
        <LeaderBoardDateTabsButton
          key={label}
          onClick={() => handleOnClick({ label, fromTime })}
          selected={selected === label}
        >
          {label}
        </LeaderBoardDateTabsButton>
      ))}
      {/*   <SelectDatePicker */}
      {/*     title="Due date" */}
      {/*     inputFormat="MM/dd/yyyy" */}
      {/*     value={fromTime} */}
      {/*     onChange={(value) => setFromTime(value)} */}
      {/*     renderInput={(params) => <StyledTextField {...params} />} */}
      {/*   /> */}
      {/* <LeaderBoardDateTabsButton onClick={() => null}>Custom</LeaderBoardDateTabsButton> */}
    </Grid>
  );
};

export default LeaderboardDateTabs;
