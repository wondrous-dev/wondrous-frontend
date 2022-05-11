const styles = {
  root: {
    '& .DateInput_fang': {
      display: 'none',
    },
    '& .CalendarDay__default': {
      borderColor: 'transparent',
      borderRadius: '4px',
    },
    '& .DayPicker_weekHeader_li': {
      visibility: 'hidden',
      fontSize: 0,
    },
    '& .DayPicker_weekHeader_li::first-letter': {
      visibility: 'visible',
      fontFamily: 'Space Grotesk',
      fontWeight: 700,
      fontSize: 12,
      lineHeight: '19px',
    },
    '& .CalendarDay__highlighted_calendar': {
      background: '#472289',
      color: 'white',
    },
  },
};

export default styles;
