import Box from '@mui/material/Box';

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
}) => (
  <Box
    role="button"
    component="td"
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
      component="span"
      sx={{
        ...styles.content,
        ...(isFocused && styles.highlighted),
        ...(modifiers?.has('highlighted-calendar') && styles.highlighted),
        ...(modifiers?.has('hovered-span') && { background: ' #472289', color: 'white' }),
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

export default CalendarDay;
