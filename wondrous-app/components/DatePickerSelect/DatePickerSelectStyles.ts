const styles = {
  root: {
    '& .MuiInputBase-input': {
      color: 'white',
      borderRadius: '6px',
      border: 0,
      outline: 'none',
      textTransform: 'capitalize',
    },
    '& .MuiOutlinedInput-root': {
      outline: 'none',

      '&.Mui-focused fieldset': {
        border: 0,
      },
      '& svg': {
        color: 'white',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
  },
  menuList: {
    background: '#474747',
    textTransform: 'capitalize',
    '&.MuiList-root': {
      padding: 1,
    },
    '& .MuiMenuItem-root': {
      display: 'block',
      padding: '8px',
      fontFamily: var(--font-space-grotesk),
      fontSize: 16,
      color: 'white',
      '&.Mui-selected': {
        backgroundColor: 'rgba(116, 39, 255, 0.2)',
      },
      '&.MuiMenuItem-root:hover': {
        background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 100%)',
        borderRadius: '6px',
      },
    },
  },
};

export default styles;
