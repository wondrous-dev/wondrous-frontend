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
    '& .MuiIconButton-root': {
      padding: 0,
      backgroundColor: palette.violet100,
      borderRadius: '4px',
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease-in-out',
    },
    '& .MuiIconButton-root:hover': {
      backgroundColor: palette.blue20,
      color: palette.violet950,
    },
    '.MuiButtonBase-root .MuiSvgIcon-root': {
      height: '10px',
      width: '10px',
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
      zIndex: 1,
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
