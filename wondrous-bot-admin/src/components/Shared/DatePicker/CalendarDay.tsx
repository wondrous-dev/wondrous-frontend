import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const styles = {
  root: {
    px: 0.75,
    display: 'inline-block',
    fontFamily: 'Space Grotesk',
    fontWeight: 400,
    fontSize: ' 12px',
    lineHeight: '19px',

    letterSpacing: '0.01em',

    color: 'black',
  },
  lowOpacity: {
    opacity: 0.5,
  },
  content: {
    width: 24,
    display: 'block',
    mt: '5px',
    borderRadius: 1,

    ':hover': {
      background: '#2A8D5C',
      color: 'white',
      fontWeight: '500',
    },
  },

  highlighted: { background: '#C6BBFC', color: 'white', fontWeight: '500' },

  selected: { background: ' #C6BBFC', color: 'white', fontWeight: '500' },
};

function CalendarDay({
  day,
  isFocused,
  isOutsideDay,
  modifiers,
  onDayClick,
  onDayMouseEnter,
  onDayMouseLeave,
  tabIndex,
}) {
  return (
    <Box
      role='button'
      component='td'
      sx={{
        ...styles.root,
        ...(isOutsideDay && styles.lowOpacity),
        ...(modifiers?.has('blocked') && styles.lowOpacity),
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
        component='span'
        sx={{
          ...styles.content,
          ...(isFocused && styles.highlighted),
          ...(modifiers?.has('highlighted-calendar') && styles.highlighted),
          ...(modifiers?.has('hovered-span') && {
            background: ' #C6BBFC',
            color: 'white',
          }),
          ...(modifiers?.has('selected-span') && styles.selected),
          ...(modifiers?.has('selected-start') && styles.highlighted),
          ...(modifiers?.has('selected-end') && styles.highlighted),
          ...(modifiers?.has('selected') && styles.highlighted),
        }}
      >
        {day.date()}
      </Box>
    </Box>
  );
}

export default CalendarDay;
