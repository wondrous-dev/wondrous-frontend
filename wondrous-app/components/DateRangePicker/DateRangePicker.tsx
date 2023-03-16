import { useState } from 'react';
import { DayPickerRangeController } from 'react-dates';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

import { DATEPICKER_FIELDS, MONTH_DAY_FULL_YEAR, DEFAULT_DATEPICKER_VALUE } from 'utils/constants';

import DatePickerNavButton from 'components/DatePickerNavButton';
import CalendarDay from 'components/CalendarDay';
import CloseIcon from 'components/Icons/close.svg';
import ClearIcon from 'components/Icons/clear.svg';
import Button from 'components/Button';

import palette from 'theme/palette';

const textFieldInputProps = ({ dateString, onClick }) => ({
  readOnly: true,
  endAdornment: dateString && (
    <Grid
      onClick={onClick}
      container
      alignItems="center"
      justifyContent="center"
      width="12px"
      sx={{
        '&:hover': {
          cursor: 'pointer',
        },
        svg: {
          transform: 'scale(0.8)',
          path: {
            fill: palette.white,
          },
        },
      }}
    >
      <CloseIcon />
    </Grid>
  ),
  sx: {
    color: palette.white,
    background: palette.background.default,
    borderRadius: '6px',
    height: '35px',
    fontSize: '15px',
    fontWeight: '500',
    padding: '8px',
    '& .MuiInputBase-input': {
      padding: '0',
    },
  },
});

type DateRangePickerProps = {
  hideRecurring?: boolean;
  blockPastDates?: boolean;
  onConfirm: (dateRange) => void;
  ButtonComponent: React.ComponentType<any>;
  ButtonComponentOnClick?: () => void;
  ButtonComponentProps?: { [key: string]: any };
};

const DateRangePicker = ({
  blockPastDates = true,
  onConfirm,
  ButtonComponent,
  ButtonComponentOnClick,
  ButtonComponentProps,
}: DateRangePickerProps) => {
  const [dateRange, setDateRange] = useState(DEFAULT_DATEPICKER_VALUE);
  const [focusedInput, setFocusedInput] = useState(null);

  moment.updateLocale('en', {
    week: {
      dow: 1,
    },
  });

  const startDateString = dateRange?.startDate?.format(MONTH_DAY_FULL_YEAR) || '';
  const endDateString = dateRange?.endDate?.format(MONTH_DAY_FULL_YEAR) || '';

  const todayMoment = moment();

  const handleOnClose = () => {
    setFocusedInput(null);
    setDateRange(DEFAULT_DATEPICKER_VALUE);
  };

  const handleOnConfirm = () => {
    onConfirm(dateRange);
    setFocusedInput(null);
  };

  return (
    <>
      <ButtonComponent
        onClick={() => {
          setFocusedInput(DATEPICKER_FIELDS.START_DATE);
          ButtonComponentOnClick?.();
        }}
        {...ButtonComponentProps}
      />
      <Dialog open={Boolean(focusedInput)} onClose={handleOnClose} sx={{}}>
        <Box width="302px" bgcolor={palette.black92} border={`1px solid ${palette.grey79}`}>
          <Box gap="10px" sx={{ background: palette.black92 }} padding="12px 25px" display="flex">
            <TextField
              type="text"
              name="start date"
              value={startDateString}
              InputProps={textFieldInputProps({
                dateString: startDateString,
                onClick: () => setDateRange({ ...dateRange, startDate: null }),
              })}
              placeholder="Start Date"
              onClick={() => setFocusedInput(DATEPICKER_FIELDS.START_DATE)}
            />
            <TextField
              type="text"
              name="end date"
              value={endDateString}
              InputProps={textFieldInputProps({
                dateString: endDateString,
                onClick: () => setDateRange({ ...dateRange, endDate: null }),
              })}
              placeholder="End Date"
              onClick={() => setFocusedInput(DATEPICKER_FIELDS.END_DATE)}
              sx={{
                background: palette.background.default,
                borderRadius: '6px',
                height: '35px',
                maxWidth: '50%',
              }}
            />
          </Box>
          <Box
            sx={{
              '& .DayPicker': {
                width: '300px !important',
                background: palette.black92,
              },
              '& .CalendarMonthGrid': {
                background: palette.black92,
              },
              '& .CalendarMonth': {
                background: palette.black92,
                '& .CalendarMonth_caption': {
                  fontSize: 13,
                  color: palette.blue20,
                  fontWeight: 500,
                },
              },
              '& .DayPicker_transitionContainer': {
                height: '250px !important',
              },
            }}
          >
            <DayPickerRangeController
              renderWeekHeaderElement={(day) => (
                <Typography fontWeight="700" fontSize="13px" color={palette.blue20}>
                  {day.toUpperCase()}
                </Typography>
              )}
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
              hideKeyboardhortcutPanel
              enableOutsideDays
              navPrev={<DatePickerNavButton prev />}
              navNext={<DatePickerNavButton next />}
              noBorder
              hideKeyboardShortcutsPanel
              customArrowIcon={null}
              isDayBlocked={(day) => blockPastDates && day.isBefore(todayMoment)}
              renderCalendarDay={(props) => <CalendarDay {...props} />}
              renderCalendarInfo={() => (
                <Grid container padding="0 25px">
                  <Grid
                    container
                    item
                    justifyContent="space-between"
                    padding="12px 0"
                    borderTop={`1px solid ${palette.grey79}`}
                  >
                    <Button
                      onClick={() => {
                        setDateRange({ startDate: null, endDate: null });
                      }}
                      color="secondary"
                      borderRadius={6}
                      height={28}
                      width="fit-content"
                      buttonTheme={{
                        fontWeight: 500,
                        fontSize: 13,
                        paddingX: 6,
                        paddingY: 8,
                      }}
                    >
                      <Grid container alignItems="center" width="fit-content" sx={{ svg: { transform: 'scale(0.6)' } }}>
                        <ClearIcon />
                        <Typography fontWeight="500" fontSize="13px" color={palette.white}>
                          Clear
                        </Typography>
                      </Grid>
                    </Button>
                    <Button
                      disabled={!dateRange.startDate || !dateRange.endDate}
                      onClick={handleOnConfirm}
                      color="purple"
                      borderRadius={200}
                      width="fit-content"
                      height={28}
                      buttonTheme={{
                        paddingY: 8,
                        paddingX: 16,
                        fontWeight: 500,
                        fontSize: 13,
                      }}
                    >
                      Confirm
                    </Button>
                  </Grid>
                </Grid>
              )}
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default DateRangePicker;
