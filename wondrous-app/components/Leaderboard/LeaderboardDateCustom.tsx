import { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import TextField from '@mui/material/TextField';

import palette from 'theme/palette';

const LeaderboardDateCustom = () => {
  const [customFromTime, setCustomFromTime] = useState(null);
  const [customToTime, setCustomToTime] = useState(null);
  const selectedDays = [customFromTime, customToTime]?.map((date) => date?.toDateString());

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        minDate={customFromTime}
        maxDate={customToTime}
        value={null}
        renderInput={(params) => <TextField {...params} />}
        onViewChange={() => null}
        onChange={() => null}
        renderDay={(day, selectedDay, pickersDayProps) => {
          if (selectedDays.includes(day.toDateString())) {
            return (
              <PickersDay
                {...pickersDayProps}
                disabled
                selected
                sx={{
                  '&.Mui-selected': {
                    fontSize: '13px',
                    fontWeight: 600,
                    borderRadius: '4px',
                    background: palette.highlightPurple,
                    color: palette.white,
                    '&:hover, &:focus': {
                      background: palette.highlightPurple,
                      color: palette.white,
                    },
                  },
                }}
              />
            );
          }
          return (
            <PickersDay
              {...pickersDayProps}
              selected={false}
              disabled={pickersDayProps.disabled || (customFromTime && customToTime)}
              disableRipple
              disableMargin
              onClick={() => {
                if (!customFromTime) {
                  setCustomFromTime(day);
                  return;
                }
                if (customFromTime && !customToTime) {
                  setCustomToTime(day);
                }
              }}
              sx={{
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '4px',
                background: 'transparent',
                color: palette.grey58,
                '&:not(.Mui-selected)': {
                  border: 'none',
                },
                '&:hover, &:focus': {
                  background: palette.highlightPurple,
                  color: palette.white,
                },
              }}
            />
          );
        }}
      />
    </LocalizationProvider>
  );
};

export default LeaderboardDateCustom;
