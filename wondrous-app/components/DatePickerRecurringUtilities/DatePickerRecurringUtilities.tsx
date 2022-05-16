import moment from 'moment';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import {
  DATEPICKER_OPTIONS,
  DEFAULT_DATEPICKER_VALUE,
  DEFAULT_SINGLE_DATEPICKER_VALUE,
  DATEPICKER_OPTIONS_ARR,
} from 'utils/constants';

import DaySelector from 'components/DaySelector';
import WeekDaySelector from 'components/WeekDaySelector';

interface DatePickerRecurringUtilitiesProps {
  date?: any;
  setDate?: any;
  dateRange?: any;
  setDateRange?: any;
  showOptions: any;
  setShowOptions: any;
  setRepeatType: any;
  repeatType: any;
  setRepeatValue: any;
  todayMoment: any;
  onWeekDaysChange: any;
  weekDaysSelected: any;
}

const DatePickerRecurringUtilities = ({
  date,
  setDate,
  dateRange,
  setDateRange,
  showOptions,
  setShowOptions,
  setRepeatType,
  repeatType,
  setRepeatValue,
  todayMoment,
  onWeekDaysChange,
  weekDaysSelected,
}: DatePickerRecurringUtilitiesProps) => {
  const clearAll = () => {
    setDate && setDate(DEFAULT_SINGLE_DATEPICKER_VALUE);
    setDateRange && setDateRange(DEFAULT_DATEPICKER_VALUE);
    setRepeatType();
    setRepeatValue();
    setShowOptions();
  };

  const handleDayChange = (e) => {
    setRepeatValue(e.target.value);
  };

  return (
    <Box p={2}>
      <Box>
        {showOptions && (
          <Box borderTop="1px dotted black">
            <Box display="flex" alignItems="center">
              <Typography>Repeats</Typography>
              <Box flex="1" />
              <TextField
                id="repeat-id"
                select
                onChange={(e) => {
                  const type = e.target.value;
                  if (type === DATEPICKER_OPTIONS.DAILY) setRepeatValue(1);
                  setRepeatType(type);
                }}
              >
                {DATEPICKER_OPTIONS_ARR.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            {repeatType === DATEPICKER_OPTIONS.WEEKLY && (
              <WeekDaySelector onWeekDaysChange={onWeekDaysChange} weekDaysSelected={weekDaysSelected} />
            )}
            {repeatType === DATEPICKER_OPTIONS.MONTHLY && (
              <Box display="flex">
                <Typography>On Day</Typography>
                <Box flex="1" />
                <Box>
                  <DaySelector dateRange={dateRange} todayMoment={todayMoment} onChange={handleDayChange} />
                </Box>
              </Box>
            )}
            {repeatType === DATEPICKER_OPTIONS.PERIODICALLY && (
              <Box display="flex">
                <Typography>Days after completion</Typography>
                <Box flex="1" />
                <Box>
                  <DaySelector dateRange={dateRange} todayMoment={todayMoment} onChange={handleDayChange} />
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Box display="flex" borderTop="1px dotted black">
        <Button onClick={() => setShowOptions(true)}>Recurring</Button>
        <Box flex="1" />
        <Button onClick={clearAll}>Clear all</Button>
      </Box>
    </Box>
  );
};

export default DatePickerRecurringUtilities;
