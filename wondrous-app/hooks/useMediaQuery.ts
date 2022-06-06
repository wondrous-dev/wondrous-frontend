import { useTheme } from '@mui/material/styles';

import useMuiMediaQuery from '@mui/material/useMediaQuery';

const useMediaQuery = () => {
  const theme = useTheme();
  const isMobileScreen = useMuiMediaQuery(theme.breakpoints.down('sm'));
  const isTabletScreen = useMuiMediaQuery(theme.breakpoints.down('md'));
  const isLaptopScreen = useMuiMediaQuery(theme.breakpoints.down('lg'));
  const isDesktopScreen = useMuiMediaQuery(theme.breakpoints.up('lg'));

  return {
    isMobileScreen,
    isTabletScreen,
    isLaptopScreen,
    isDesktopScreen,
  };
};

export default useMediaQuery;
