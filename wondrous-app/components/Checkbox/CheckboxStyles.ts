const styles = {
  checkbox: {
    '&.MuiCheckbox-root': {
      color: '#7427FF',
      fill: 'white',

      '&.Mui-checked': {
        color: '#7427FF',
      },
      ':hover': {
        backgroundColor: 'rgba(116, 39, 255, 0.04)',
      },
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
