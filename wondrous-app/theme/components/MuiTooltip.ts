import palette from 'theme/palette';

const MuiTooltip = {
  styleOverrides: {
    popper: {
      '& p': {
        color: palette.white,
      },
    },
    tooltip: {
      backgroundColor: palette.grey800,
    },
    arrow: {
      '&:before': {
        backgroundColor: palette.grey800,
      },
    },
  },
};

export default MuiTooltip;
