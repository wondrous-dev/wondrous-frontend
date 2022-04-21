export const inputStyles = ({ theme }) => ({
  '&&': {
    '& .MuiInputBase-input': {
      color: 'white',
      padding: theme.spacing(1.5),
      backgroundColor: '#0F0F0F',
      borderRadius: '6px',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#7427FF',
      },
      '& svg': {
        color: 'white',
      },
    },
  },
});

export const menuItemStyles = ({ theme }) => ({
  '&&': {
    display: 'block',
  },
});
