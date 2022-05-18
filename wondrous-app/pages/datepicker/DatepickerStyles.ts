const styles = {
  container: {
    width: '90vw',
    height: '90vh',
    margin: '2em auto',
    background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 100%)',
    padding: '2em',
  },
  datepicker: {
    '& .DayPicker': {
      background: '#1D1D1D',
    },
    '& .DayPicker__horizontal': {
      background: '#1D1D1D',
    },
    '& .CalendarMonthGrid': {
      background: '#1D1D1D',
    },
    '& .CalendarMonth': {
      background: '#1D1D1D',
      color: '#C4C4C4',
    },
    '& .CalendarMonth_caption': {
      color: '#CCBBFF',
    },
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
      color: '#CCBBFF',
    },
  },
};

export default styles;
