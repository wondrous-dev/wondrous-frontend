import palette from 'theme/palette';

const styles = {
  infoAlert: {
    background: palette.violet950,
    alignItems: 'center',
    border: `1px solid ${palette.violet100}`,
    borderRadius: '6px',
    height: '36px',
    padding: '0 7px',
    color: palette.white,
    '.MuiAlert-icon svg': {
      color: palette.blue20,
    },
    '.MuiAlert-action': {
      margin: '0 0 0 70px',
      padding: 0,
    },
  },
  viewDropdown: {
    innerStyle: {
      background: palette.grey87,
      maxWidth: '150px',
      padding: 0,
      margin: 0,
      fontSize: '15px',
      color: palette.white,
    },
    formSelectStyle: {
      height: 'auto',
    },
    MenuProps: {
      PaperProps: {
        sx: {
          maxHeight: '250px',
          width: '100%',
          maxWidth: 150,
          background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
          padding: '15px',
          '*::-webkit-scrollbar': {
            width: 100,
          },
        },
      },
    },
  },
};

export default styles;
