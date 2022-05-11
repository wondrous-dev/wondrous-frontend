import moment from 'moment';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import styles from './DaySelectorStyles';

const DaySelector = ({ dateRange, todayMoment, onChange }) => {
  const daysInMonth = Array.from(
    Array(moment(dateRange?.startDate || dateRange?.endDate || todayMoment).daysInMonth()),
    (_, i) => i + 1
  );

  return (
    <TextField select onChange={onChange}>
      {daysInMonth?.map((_, idx) => (
        // TODO: style this
        <MenuItem key={idx + 1} value={idx + 1}>
          {idx + 1}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default DaySelector;
