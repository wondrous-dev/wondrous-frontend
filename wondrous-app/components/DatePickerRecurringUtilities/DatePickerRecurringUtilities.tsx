import Image from 'next/legacy/image';

import Box from '@mui/material/Box';
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

import DatePickerSelect from 'components/DatePickerSelect';
import styles from './DatePickerRecurringUtilitiesStyles';

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
  repeatValue: any;
  todayMoment: any;
  onWeekDaysChange: any;
  weekDaysSelected: any;
  monthInView: any;
}

function DatePickerRecurringUtilities({
  date,
  setDate,
  dateRange,
  setDateRange,
  showOptions,
  setShowOptions,
  setRepeatType,
  repeatType,
  repeatValue,
  setRepeatValue,
  todayMoment,
  monthInView,
  onWeekDaysChange,
  weekDaysSelected,
}: DatePickerRecurringUtilitiesProps) {
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
    <Box mt={-8}>
      <Box>
        {showOptions && (
          <Box sx={styles.borderContainer}>
            <Box display="flex" alignItems="center">
              Repeats
              <Box flex="1" />
              <DatePickerSelect
                id="repeat-id"
                select
                onChange={(e) => {
                  const type = e.target.value;
                  if (type === DATEPICKER_OPTIONS.DAILY) setRepeatValue(1);
                  setRepeatType(type);
                }}
                defaultValue={repeatType}
              >
                {DATEPICKER_OPTIONS_ARR.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </DatePickerSelect>
            </Box>
            {repeatType === DATEPICKER_OPTIONS.WEEKLY && (
              <WeekDaySelector onWeekDaysChange={onWeekDaysChange} weekDaysSelected={weekDaysSelected} />
            )}
            {repeatType === DATEPICKER_OPTIONS.MONTHLY && (
              <Box display="flex" mt={1} alignItems="center">
                On Day
                <Box flex="1" />
                <Box>
                  <DaySelector
                    dateRange={dateRange}
                    monthInView={monthInView}
                    todayMoment={todayMoment}
                    onChange={handleDayChange}
                    repeatValue={repeatValue}
                  />
                </Box>
              </Box>
            )}
            {repeatType === DATEPICKER_OPTIONS.PERIODICALLY && (
              <Box display="flex" mt={1} alignItems="center">
                Days after completion
                <Box flex="1" />
                <Box>
                  <DaySelector
                    dateRange={dateRange}
                    date={date}
                    monthInView={monthInView}
                    todayMoment={todayMoment}
                    onChange={handleDayChange}
                    repeatValue={repeatValue}
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Box display="flex" sx={styles.borderContainer}>
        <Button onClick={() => setShowOptions(true)} sx={styles.recurringButton}>
          <Image src="/images/icons/recurring.svg" width={14} height={16} alt="Recurring button" />
          <Box ml={1.25} />
          Recurring
        </Button>
        <Box flex="1" />
        <Button onClick={clearAll} sx={styles.clearButton}>
          Clear all
        </Button>
      </Box>
    </Box>
  );
}

export default DatePickerRecurringUtilities;
