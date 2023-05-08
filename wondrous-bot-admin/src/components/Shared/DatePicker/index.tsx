import { useEffect, useRef, useState } from 'react';
import { DayPickerRangeController } from 'react-dates';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

import {
  DATEPICKER_FIELDS,
  MONTH_DAY_FULL_YEAR,
  DEFAULT_DATEPICKER_VALUE,
} from 'utils/constants';

import DatePickerNavButton from './DatePickerNavButton';
import CalendarDay from './CalendarDay';
import { ClearIcon, CloseIcon } from './Icons';
// import ClearIcon from 'components/Icons/clear.svg';
import { SharedSecondaryButton } from '../styles';
import Popper from '@mui/material/Popper';
import { ButtonBase, ClickAwayListener } from '@mui/material';
import { BackspaceOutlined } from '@mui/icons-material';

// import palette from 'theme/palette';

const textFieldInputProps = ({ dateString, onClick }) => ({
  readOnly: true,
  endAdornment: dateString && (
    <Grid
      onClick={onClick}
      container
      alignItems='center'
      justifyContent='center'
      width='12px'
      sx={{
        '&:hover': {
          cursor: 'pointer',
        },
        svg: {
          transform: 'scale(0.8)',
          path: {
            fill: 'white',
          },
        },
      }}
    >
      <CloseIcon />
    </Grid>
  ),
  sx: {
    borderRadius: '6px',
    height: '40px',
    background: ' #C6BBFC',
    fontSize: '15px',
    color: 'black',
    fontWeight: '500',
    padding: '8px',
    '& .MuiInputBase-input': {
      padding: '0',
      '&::placeholder': {
        color: 'black',
      },
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
  startToday?: boolean;
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

  const anchorEl = useRef(null);

  moment.updateLocale('en', {
    week: {
      dow: 1,
    },
  });

  const startDateString =
    dateRange?.startAt?.format(MONTH_DAY_FULL_YEAR) || '';
  const endDateString = dateRange?.endAt?.format(MONTH_DAY_FULL_YEAR) || '';

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
    <ClickAwayListener onClickAway={handleOnClose} mouseEvent='onMouseDown'>
      <div>
        <div ref={anchorEl}>
          <ButtonComponent
            onClick={() => {
              setFocusedInput(DATEPICKER_FIELDS.START_DATE);
              ButtonComponentOnClick?.();
            }}
            {...ButtonComponentProps}
          />
        </div>
        <Popper
          open={Boolean(focusedInput)}
          anchorEl={anchorEl.current}
          placement={'bottom'}
          modifiers={[
            {
              name: 'flip',
              enabled: true,
              options: {
                altBoundary: true,
                rootBoundary: 'document',
                padding: 8,
              },
            },
            {
              name: 'preventOverflow',
              enabled: true,
              options: {
                altAxis: true,
                altBoundary: true,
                tether: true,
                rootBoundary: 'document',
                padding: 8,
              },
            },
          ]}
        >
          <Box
            width='302px'
            borderRadius='16px'
            border='1px solid #000000'
            overflow='hidden'
          >
            <Box
              gap='10px'
              padding='12px 25px'
              display='flex'
              bgcolor='#2A8D5C'
            >
              <TextField
                type='text'
                name='start date'
                value={startDateString}
                InputProps={textFieldInputProps({
                  dateString: startDateString,
                  onClick: () =>
                    setDateRange({ ...dateRange, startAt: null }),
                })}
                placeholder='Start Date'
                onClick={() => setFocusedInput(DATEPICKER_FIELDS.START_DATE)}
              />
              <TextField
                type='text'
                name='end date'
                value={endDateString}
                InputProps={textFieldInputProps({
                  dateString: endDateString,
                  onClick: () => setDateRange({ ...dateRange, endAt: null }),
                })}
                placeholder='End Date'
                onClick={() => setFocusedInput(DATEPICKER_FIELDS.END_DATE)}
                sx={{
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
                },
                '& .CalendarMonth': {
                  '& .CalendarMonth_caption': {
                    fontSize: 13,
                    color: '#2A8D5C',
                    fontFamily: 'Poppins',
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
                  <Typography
                    fontWeight='700'
                    fontSize='13px'
                    color={'#2A8D5C'}
                  >
                    {day?.[0]}
                  </Typography>
                )}
                startDate={dateRange.startAt}
                startDateId='your_unique_start_date_id'
                endDate={dateRange.endAt}
                endDateId='your_unique_end_date_id'
                onDatesChange={({ startDate, endDate }) =>
                  setDateRange({ startAt: startDate, endAt: endDate })
                }
                focusedInput={focusedInput}
                onFocusChange={(focusedInput) =>
                  focusedInput && setFocusedInput(focusedInput)
                }
                numberOfMonths={1}
                displayFormat='MM/DD/yyyy'
                daySize={36}
                minimumNights={0}
                hideKeyboardhortcutPanel
                enableOutsideDays
                navPrev={<DatePickerNavButton prev />}
                navNext={<DatePickerNavButton next />}
                noBorder
                hideKeyboardShortcutsPanel
                customArrowIcon={null}
                isDayBlocked={(day) =>
                  blockPastDates && day.isBefore(todayMoment)
                }
                renderCalendarDay={(props) => <CalendarDay {...props} />}
                renderCalendarInfo={() => (
                  <Grid container padding='0 25px'>
                    <Grid
                      container
                      item
                      justifyContent='space-between'
                      padding='12px 0'
                      borderTop={`1px solid black`}
                    >
                      <ButtonBase
                        onClick={() => {
                          setDateRange({ startAt: null, endAt: null });
                        }}
                        sx={{
                          borderRadius: '6px',
                          background: '#C6BBFC',
                          padding: '7px 9px',
                        }}
                      >
                        <Grid
                          container
                          alignItems='center'
                          width='fit-content'
                          sx={{ svg: { transform: 'scale(0.6)' } }}
                        >
                          <BackspaceOutlined
                            sx={{
                              color: 'black',
                            }}
                          />
                          <Typography
                            fontWeight='500'
                            fontSize='13px'
                            color={'black'}
                            fontFamily='Poppins'
                          >
                            Clear
                          </Typography>
                        </Grid>
                      </ButtonBase>
                      <SharedSecondaryButton
                        disabled={!dateRange.startAt || !dateRange.endAt}
                        onClick={handleOnConfirm}
                        color='purple'
                        width='fit-content'
                        height={28}
                        sx={{
                          borderRadius: '6px !important',
                        }}
                      >
                        Confirm
                      </SharedSecondaryButton>
                    </Grid>
                  </Grid>
                )}
              />
            </Box>
          </Box>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default DateRangePicker;
