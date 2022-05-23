import { useState } from 'react';

import Box from '@mui/material/Box';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';

import DateRangePicker from 'components/DateRangePicker';
import SingleDatePicker from 'components/SingleDatePicker';

import styles from './DatepickerContainerStyles';

const DatepickerContainer = ({}) => {
  const [value, setValue] = useState(null);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={styles.container}>
        <Box>
          <Box>
            <Box>DISCARDED RANGE OPTION IS INCLUDED IN THE PAID PLAN</Box>
            <DesktopDatePicker
              label="Date desktop"
              inputFormat="MM/dd/yyyy"
              value={value}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
          <DateRangePicker sx={styles.datepicker} />
          <Box mt={4} />
          <SingleDatePicker sx={styles.datepicker} />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default DatepickerContainer;
