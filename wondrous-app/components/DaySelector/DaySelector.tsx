import moment from 'moment';
import last from 'lodash/last';

import MenuItem from '@mui/material/MenuItem';
import DatePickerSelect from 'components/DatePickerSelect';

import styles from './DaySelectorStyles';

const DaySelector = ({ dateRange, todayMoment, onChange }) => {
  const daysInMonth = Array.from(
    Array(moment(dateRange?.startDate || dateRange?.endDate || todayMoment).daysInMonth()),
    (_, i) => i + 1
  );

  const lastDay = last(daysInMonth);
  console.log(daysInMonth);

  return (
    <DatePickerSelect select onChange={onChange}>
      {daysInMonth?.map((day) => (
        <MenuItem key={day} value={day} sx={styles.menuItem}>
          {day === lastDay ? 'Last' : day}
        </MenuItem>
      ))}
    </DatePickerSelect>
  );
};

export default DaySelector;
