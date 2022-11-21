const styles = {
  root: {
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
      fontFamily: var(--font-space-grotesk),
      fontWeight: 700,
      fontSize: 12,
      lineHeight: '19px',
      color: '#CCBBFF',
    },
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 1.5,
    backgroundColor: '#1D1D1D',
    borderBottom: '0.5px dashed #4B4B4B',
    paddingBottom: 2,
  },
  mainContainer: {
    border: '1px solid #4B4B4B',
    borderRadius: '6px',
  },
  calendarIcon: {
    '&.MuiInputAdornment-root': {
      backgroundColor: '#0F0F0F',
      minWidth: 26,
      minHeight: 26,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 1,
      ml: 1.5,
      mr: 0,
    },
  },
  mainTextfield: {
    '& .MuiInputBase-input': {
      color: 'white',
      padding: 1.5,
      borderRadius: '6px',
    },
    '& .MuiOutlinedInput-root': {
      border: '1px solid #4B4B4B',
      paddingLeft: 0,

      '&.Mui-focused fieldset': {
        borderColor: '#4B4B4B',
      },
      '& svg': {
        color: 'white',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
  },
  darkTextfield: {
    '& .MuiInputBase-input': {
      color: 'white',
      padding: 1.5,
      borderRadius: '6px',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#0F0F0F',

      '&.Mui-focused fieldset': {
        borderColor: '#7427FF',
      },
      '& svg': {
        color: 'white',
      },
    },
  },
  mainTextfieldInactive: {
    '& .MuiInputBase-input': {
      color: 'white',
      padding: 1.5,
      borderRadius: '6px',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#0F0F0F',
      paddingLeft: 0,
      '&.Mui-focused fieldset': {
        borderColor: '#7427FF',
      },
    },
  },
};

export default styles;
