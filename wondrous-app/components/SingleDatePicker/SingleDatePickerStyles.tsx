const styles = {
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 1.5,
    backgroundColor: '#1D1D1D',
  },
  mainContainer: {
    border: '1px solid #4B4B4B',
    borderRadius: '6px',
  },
  mainTextfield: {
    '& .MuiInputBase-input': {
      color: 'white',
      padding: 1.5,
      border: '1px solid #4B4B4B',
      borderRadius: '6px',
    },
    '& .MuiOutlinedInput-root': {
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
    borderBottom: '0.5px dashed #4B4B4B',
    pb: 2,

    '& .MuiInputBase-input': {
      color: 'white',
      padding: 1.5,
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
};

export default styles;

export const inputStyles = ({ theme }) => ({
  '&&': {},
});
