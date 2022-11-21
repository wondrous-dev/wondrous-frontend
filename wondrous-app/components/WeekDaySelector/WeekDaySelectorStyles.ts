const styles = {
  formControlLabel: {
    ml: 0,
    mr: 0,
    '& .MuiTypography-root': {
      color: 'white',
    },
  },
  formGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'noWrap',
    marginLeft: -1,
    '.MuiSvgIcon-root ': {
      fontSize: 16,
    },
  },
  label: {
    '&.MuiFormLabel-root': {
      color: 'white',
      fontFamily: var(--font-space-grotesk),
      fontWeight: 400,
      fontSize: ' 14px',
      lineHeight: '16px',
      marginBottom: 2,
      '&.Mui-focused': {
        color: 'white',
      },
    },
  },
};

export default styles;
