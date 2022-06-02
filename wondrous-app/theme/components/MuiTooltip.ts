import { white, greyColors } from 'theme/colors';

const MuiTooltip = {
  styleOverrides: {
    popper: {
      '& p': {
        color: white,
      },
    },
    tooltip: {
      backgroundColor: greyColors.grey800,
    },
    arrow: {
      '&:before': {
        backgroundColor: greyColors.grey800,
      },
    },
  },
};

export default MuiTooltip;
