import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import SingleDatePicker from 'components/SingleDatePicker';

import styles from './DatepickerStyles';

const DatepickerSpike = ({ }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box sx={styles.container}>
      <Box>
        <SingleDatePicker sx={styles.datepicker} />
      </Box>
    </Box>
  </LocalizationProvider>
);

export default DatepickerSpike;
