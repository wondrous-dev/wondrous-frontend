import { useMemo, useState } from 'react';
import { DayPickerSingleDateController } from 'react-dates';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import {
  DATEPICKER_FIELDS,
  DATEPICKER_OPTIONS,
  DEFAULT_SINGLE_DATEPICKER_VALUE,
  WEEK_DAYS,
  DAY_STRING_MONTH_SHORT_YEAR,
  MONTH_DAY_FULL_YEAR,
} from 'utils/constants';

import DatePickerRecurringUtilities from 'components/DatePickerRecurringUtilities';
import CalendarDay from 'components/CalendarDay';

import styles from './SingleDatePickerStyles';

const SingleDatePicker = ({}) => {
  const [date, setDate] = useState(DEFAULT_SINGLE_DATEPICKER_VALUE);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [repeatType, setRepeatType] = useState();
  const [repeatValue, setRepeatValue] = useState();
  const [weekDaysSelected, setWeekDaysSelected] = useState(WEEK_DAYS);

  moment.updateLocale('en', {
    week: {
      dow: 1,
    },
  });

  const todayMoment = moment();

  const displayValue = useMemo(() => {
    if (!date && !repeatType) return '';

    const start = date?.format(DAY_STRING_MONTH_SHORT_YEAR);

    return `${start ? `${start}` : ''}${repeatType ? ` - ${repeatType}` : ''}`;
  }, [date, repeatType]);

  const startDateString = date?.format(MONTH_DAY_FULL_YEAR) || '';

  const parsedWeekDays = Object.values(weekDaysSelected)
    .map((item, idx) => (item ? idx : null))
    .filter((item) => item || item === 0);

  const handleWeekDaysChange = (event) => {
    setWeekDaysSelected({
      ...weekDaysSelected,
      [event.target.name]: event.target.checked,
    });
  };

  const highlightDay = (day) => {
    const initialDate = date || todayMoment;
    const dayOfyear = day.dayOfYear();
    const initialDayOfYear = initialDate.dayOfYear();

    if (repeatType === DATEPICKER_OPTIONS.DAILY) {
      return day.isSameOrAfter(initialDate);
    }
    if (repeatType === DATEPICKER_OPTIONS.WEEKLY) {
      return parsedWeekDays.includes(day.weekday()) && dayOfyear > initialDayOfYear;
    }
    if (repeatType === DATEPICKER_OPTIONS.MONTHLY) {
      return day.date() === repeatValue && dayOfyear > initialDayOfYear;
    }
    if (repeatType === DATEPICKER_OPTIONS.PERIODICALLY) {
      const rest = (dayOfyear + initialDayOfYear) % Number(repeatValue);
      return rest === 0 && dayOfyear > initialDayOfYear;
    }
    return false;
  };

  return (
    <Box mt={4} display="flex" flexDirection="column" maxWidth={300}>
      <TextField
        placeholder="Choose date"
        InputProps={{
          readOnly: true,
        }}
        value={displayValue}
        onClick={() => setFocusedInput(true)}
      />

      {focusedInput && (
        <Box>
          <TextField
            value={startDateString}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            placeholder="Start Date"
          />
          <Box sx={styles.root}>
            <DayPickerSingleDateController
              date={date}
              initialDate={date}
              id="your_unique_id"
              onDateChange={(date) => setDate(date)}
              focusedInput={focusedInput}
              onFocusChange={(prop) => {
                console.log();
                // setFocusedInput(focused);
              }}
              onOutsideClick={() => {
                console.log('outside');
              }}
              numberOfMonths={1}
              displayFormat="MM/DD/yyyy"
              daySize={36}
              minimumNights={0}
              enableOutsideDays
              customArrowIcon={<></>}
              isDayHighlighted={(day) => highlightDay(day)}
              isDayBlocked={(day) => day.isBefore(todayMoment)}
              renderCalendarDay={(props) => <CalendarDay {...props} />}
              renderCalendarInfo={() => (
                <DatePickerRecurringUtilities
                  showOptions={showOptions}
                  setShowOptions={setShowOptions}
                  setDate={setDate}
                  setRepeatType={setRepeatType}
                  repeatType={repeatType}
                  setRepeatValue={setRepeatValue}
                  date={date}
                  todayMoment={todayMoment}
                  onWeekDaysChange={handleWeekDaysChange}
                  weekDaysSelected={weekDaysSelected}
                />
              )}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SingleDatePicker;
