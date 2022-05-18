import moment from 'moment';

import MenuItem from '@mui/material/MenuItem';
import DatePickerSelect from 'components/DatePickerSelect';

import styles from './DaySelectorStyles';

const DaySelector = ({ dateRange, todayMoment, onChange }) => {
  const daysInMonth = Array.from(
    Array(moment(dateRange?.startDate || dateRange?.endDate || todayMoment).daysInMonth()),
    (_, i) => i + 1
  );

  return (
    <DatePickerSelect select onChange={onChange}>
      {daysInMonth?.map((_, idx) => (
        // TODO: style this
        <MenuItem key={idx + 1} value={idx + 1} sx={styles.menuItem}>
          {idx + 1}
        </MenuItem>
      ))}
    </DatePickerSelect>
  );
};

export default DaySelector;
