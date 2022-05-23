import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import SingleDatePicker from 'components/SingleDatePicker';

import styles from './DatepickerContainerStyles';

const DatepickerContainer = ({ }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box sx={styles.container}>
      <SingleDatePicker sx={styles.datepicker} />
    </Box>
  </LocalizationProvider>
);


export default DatepickerContainer;
