const styles = {
  container: {
    // This container is white to focus on functionality, styles for the next iteration
    width: '90vw',
    height: '90vh',
    margin: '2em auto',
    background: 'white',
    padding: '2em',
  },
  datepicker: {
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
