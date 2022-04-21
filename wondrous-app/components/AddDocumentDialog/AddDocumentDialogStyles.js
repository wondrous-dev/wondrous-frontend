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

export const cancelStyles = ({ theme }) => ({
  '&&': {
    backgroundColor: '#232323',
    color: 'white',
    padding: '6px 24px',
  },
});

export const addDocStyles = ({ theme }) => ({
  '&&': {
    background: 'linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%)',
    color: 'white',
    padding: '1px 1px',

    '& .MuiBox-root': {
      background: '#0f0f0f',
      fontFamily: 'Space Grotesk',
      fontSize: 15,
      fontStyle: 'normal',
      fontWeight: 500,
      padding: '6px 24px',
      borderRadius: '64px',
    },
  },
});

const styles = {
  white: {
    color: 'white',
  },
  backgroundPaper: {
    background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 100%);',
  },
  titleIcon: {
    width: 50,
    height: 50,
    background: '#141414',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 1.5,
  },
  category: {
    color: '#ccbbff',
    ml: 0.5,
  },
  dialogTitle: {
    py: 3,
    px: 0,
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    borderBottom: '1px solid #363636;',
    '&.MuiTypography-root': {
      mx: 3,
    },
  },
  closeButton: {
    cursor: 'pointer',
    height: 34,
    width: 34,
    borderRadius: 20,
    background: '#141414',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dialogActions: {
    py: 3,
    px: 0,
    mx: 3,
    borderTop: '1px solid #363636;',
  },
  separator: {
    borderTop: '1px solid #363636;',
    py: 4,
    mt: 4,
  },
};

export default styles;
