import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import styles from './CalendarDayStyles';

const CalendarDay = ({
  day,
  isFocused,
  isOutsideDay,
  modifiers,
  onDayClick,
  onDayMouseEnter,
  onDayMouseLeave,
  tabIndex,
}) => {
  return (
    <Box
      role="button"
      component="td"
      sx={{
        px: 0.75,
        ...(isOutsideDay && { opacity: 0.5 }),
        ...(modifiers?.has('blocked') && { opacity: 0.5 }),
        display: 'inline-block',
      }}
      onMouseEnter={(e) => {
        onDayMouseEnter(day, e);
      }}
      onMouseLeave={(e) => {
        onDayMouseLeave(day, e);
      }}
      onMouseUp={(e) => {
        e.currentTarget.blur();
      }}
      onClick={(e) => {
        onDayClick(day, e);
      }}
      tabIndex={tabIndex}
    >
      <Box
        component="span"
        sx={{
          width: 24,
          display: 'block',
          mt: '5px',
          borderRadius: 1,
          ...(isFocused && { background: ' #7427FF', color: 'white' }),
          ...(modifiers?.has('highlighted-calendar') && { background: ' #7427FF', color: 'white' }),
          ...(modifiers?.has('hovered-span') && { background: ' #472289', color: 'white' }),
          ...(modifiers?.has('selected-span') && { background: ' #472289', color: 'white' }),
          ...(modifiers?.has('selected-start') && { background: ' #7427FF', color: 'white' }),
          ...(modifiers?.has('selected-end') && { background: ' #7427FF', color: 'white' }),
          ...(modifiers?.has('selected') && { background: ' #7427FF', color: 'white' }),

          ':hover': {
            background: ' #7427FF',
            color: 'white',
          },
        }}
      >
        {day.date()}
      </Box>
    </Box>
  );
};

export default CalendarDay;
