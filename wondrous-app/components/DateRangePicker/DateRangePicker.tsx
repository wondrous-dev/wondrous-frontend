import { useMemo, useState, useEffect } from 'react';
import { DayPickerRangeController } from 'react-dates';
import moment, { weekdays } from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { DATEPICKER_FIELDS, DATEPICKER_OPTIONS, DEFAULT_DATEPICKER_VALUE } from 'utils/constants';
import DatePickerRecurringUtilities from 'components/DatePickerRecurringUtilities';

import styles from './DateRangePickerStyles';
import { getDayOfYear } from 'date-fns';

const MONTH_DAY_FULL_YEAR = 'MM/DD/YYYY';
const DAY_STRING_MONTH_SHORT_YEAR = 'DD/MMM/YY';

const WEEK_DAYS = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
};

const DateRangePicker = ({}) => {
  const [dateRange, setDateRange] = useState(DEFAULT_DATEPICKER_VALUE);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [repeatType, setRepeatType] = useState();
  const [repeatValue, setRepeatValue] = useState();
  const [weekDaysSelected, setWeekDaysSelected] = useState(WEEK_DAYS);

  const parsedWeekDays = Object.values(weekDaysSelected)
    .map((item, idx) => (item ? idx + 1 : null))
    .filter((item) => item);

  console.log(parsedWeekDays);

  console.log(weekDaysSelected);

  const handleWeekDaysChange = (event) => {
    setWeekDaysSelected({
      ...weekDaysSelected,
      [event.target.name]: event.target.checked,
    });
  };

  const startDateString = dateRange?.startDate?.format(MONTH_DAY_FULL_YEAR) || '';
  const endDateString = dateRange?.endDate?.format(MONTH_DAY_FULL_YEAR) || '';

  const todayMoment = moment();

  const displayValue = useMemo(() => {
    const start = dateRange?.startDate?.format(DAY_STRING_MONTH_SHORT_YEAR);
    const end = dateRange?.endDate?.format(DAY_STRING_MONTH_SHORT_YEAR);

    if (!start && !end && !repeatType) return '';

    return `${start ? `${start} - ` : ''} ${end ? end : ''} ${repeatType ? repeatType : ''}`;
  }, [dateRange, repeatType]);

  const setDateAtStartDate = () => {
    if (dateRange.startDate) return setDateRange({ ...dateRange, endDate: null });
    return setDateRange({ startDate: dateRange.endDate, endDate: null });
  };

  const setDateAtEndDate = () => {
    if (dateRange.endDate) return setDateRange({ ...dateRange, startDate: null });
    return setDateRange({ endDate: dateRange.startDate, startDate: null });
  };

  const highlightDay = (day) => {
    if (repeatType === DATEPICKER_OPTIONS.DAILY) {
      setFocusedInput(DATEPICKER_FIELDS.START_DATE);
      return day.isSameOrAfter(dateRange.startDate || todayMoment);
    }
    if (repeatType === DATEPICKER_OPTIONS.WEEKLY) {
      setFocusedInput(DATEPICKER_FIELDS.START_DATE);

      const initialDate = dateRange.startDate || todayMoment;
      const dayOfyear = day.dayOfYear();
      const initialDayOfYear = initialDate.dayOfYear();

      return parsedWeekDays.includes(day.isoWeekday()) && dayOfyear > initialDayOfYear;
    }
    if (repeatType === DATEPICKER_OPTIONS.MONTHLY) {
      setFocusedInput(DATEPICKER_FIELDS.START_DATE);
      return day.date() === repeatValue;
    }
    if (repeatType === DATEPICKER_OPTIONS.PERIODICALLY) {
      setFocusedInput(DATEPICKER_FIELDS.START_DATE);

      const initialDate = dateRange.startDate || todayMoment;
      const initialDayOfYear = initialDate.dayOfYear();

      const dayOfyear = day.dayOfYear();

      const rest = (dayOfyear + initialDayOfYear) % Number(repeatValue);

      return rest === 0 && dayOfyear > initialDayOfYear;
    }

    // return day.dayOfYear() === moment().dayOfYear() ? true : false;
  };

  useEffect(() => {
    if (repeatType === DATEPICKER_OPTIONS.DAILY) {
      setDateAtStartDate();
    }
    if (repeatType === DATEPICKER_OPTIONS.MONTHLY) {
      setDateAtStartDate();
    }
    if (repeatType === DATEPICKER_OPTIONS.PERIODICALLY) {
      setDateAtStartDate();
    }
  }, [repeatType]);

  console.log(displayValue);

  return (
    <Box mt={4} display="flex" flexDirection="column" maxWidth={300}>
      <TextField
        onClick={() => setFocusedInput(DATEPICKER_FIELDS.END_DATE)}
        placeholder="Choose date"
        InputProps={{
          readOnly: true,
        }}
        value={displayValue}
      />

      {focusedInput && (
        <Box>
          <Box display="flex">
            <TextField
              type="text"
              name="start date"
              value={startDateString}
              InputProps={{
                readOnly: true,
              }}
              placeholder="Start Date"
            />
            <TextField
              type="text"
              name="end date"
              value={endDateString}
              InputProps={{
                readOnly: true,
              }}
              placeholder="End Date"
            />
          </Box>
          <Box sx={styles.root}>
            <DayPickerRangeController
              startDate={dateRange.startDate}
              startDateId="your_unique_start_date_id"
              endDate={dateRange.endDate}
              endDateId="your_unique_end_date_id"
              onDatesChange={({ startDate, endDate }) => setDateRange({ startDate, endDate })}
              focusedInput={focusedInput}
              onFocusChange={(focusedInput) => focusedInput && setFocusedInput(focusedInput)}
              numberOfMonths={1}
              displayFormat="MM/DD/yyyy"
              daySize={36}
              minimumNights={0}
              enableOutsideDays
              // appendToBody
              customArrowIcon={<></>}
              isDayHighlighted={(day) => highlightDay(day)}
              isDayBlocked={(day) => day.isBefore(todayMoment)}
              // renderCalendarDay={(props) => <CustomizableCalendarDay {...props} {...customDayStyles} />}
              // Reference component => https://github.com/react-dates/react-dates/blob/master/src/components/CustomizableCalendarDay.jsx
              renderCalendarInfo={() => (
                <DatePickerRecurringUtilities
                  showOptions={showOptions}
                  setShowOptions={setShowOptions}
                  setDateRange={setDateRange}
                  setRepeatType={setRepeatType}
                  repeatType={repeatType}
                  setRepeatValue={setRepeatValue}
                  dateRange={dateRange}
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

export default DateRangePicker;
