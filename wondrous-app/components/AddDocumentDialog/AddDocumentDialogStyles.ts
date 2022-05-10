export const labelStyles = ({ theme }) => ({
  '&&': {
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '18px',
    letterSpacing: '0.01em',
    color: ' #CCBBFF',
    marginBottom: theme.spacing(1.25),
    marginLeft: theme.spacing(1),
  },
});

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
    },
  },
});

const styles = {
  separator: {
    borderTop: '1px solid #363636;',
    py: 4,
    mt: 4,
  },
};

export default styles;
