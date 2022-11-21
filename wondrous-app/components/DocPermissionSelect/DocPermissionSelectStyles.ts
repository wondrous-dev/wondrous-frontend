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

export const menuItemStyles = () => ({
  '&&': {
    display: 'block',
    padding: 8,
    fontFamily: var(--font-space-grotesk),
    fontSize: 16,
    color: 'white',

    '&:hover': {
      background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 100%)',
      borderRadius: 6,
    },
  },
});

const styles = {
  menuList: {
    background: '#474747',
    '&.MuiList-root': {
      padding: 1,
    },
  },
};

export default styles;
