const styles = {
  formControlLabel: {
    ml: 0,
    mr: 0,
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
    color: 'white',
    fontFamily: 'Space Grotesk',
    fontWeight: 400,
    fontSize: ' 14px',
    lineHeight: '16px',
    '&.Mui-focused': {
      color: 'white',
    },
  },
  checkbox: {
    color: '#7427FF',
    fill: 'white',

    '&.Mui-checked': {
      color: '#7427FF',
    },
    ':hover': {
      backgroundColor: 'rgba(116, 39, 255, 0.04)',
    },
  },
  icon: {
    width: 16,
    height: 16,
    color: 'white',
    backgroundColor: '#7427FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2px',
  },
};

export default styles;
