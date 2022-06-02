import { useEffect, useState } from 'react';
import moment from 'moment';
import last from 'lodash/last';

import MenuItem from '@mui/material/MenuItem';

import DatePickerSelect from 'components/DatePickerSelect';

import styles from './DaySelectorStyles';

interface DaySelectorProps {
  date?: any;
  dateRange?: any;
  onChange: any;
  todayMoment: any;
  monthInView: any;
  repeatValue: any;
}

const DaySelector = ({ dateRange, todayMoment, onChange, date, monthInView, repeatValue }: DaySelectorProps) => {
  const [lastSelected, setLastSelected] = useState(false);

  const daysInMonth = Array.from(
    Array(moment(dateRange?.startDate || dateRange?.endDate || date || monthInView || todayMoment).daysInMonth()),
    (_, i) => i + 1
  );

  const lastDay = last(daysInMonth);

  const handleOnChange = (e) => {
    onChange(e);

    if (e.target.value === lastDay) {
      setLastSelected(true);
      return;
    }
    setLastSelected(false);
  };

  useEffect(() => {
    if (lastSelected) {
      onChange({ target: { value: lastDay } });
    }
  }, [monthInView]);

  return (
    <DatePickerSelect select onChange={handleOnChange} value={lastSelected ? lastDay : repeatValue}>
      {daysInMonth?.map((day) => (
        <MenuItem key={day} value={day} sx={styles.menuItem}>
          {day === lastDay ? 'Last' : day}
        </MenuItem>
      ))}
    </DatePickerSelect>
  );
};

export default DaySelector;
