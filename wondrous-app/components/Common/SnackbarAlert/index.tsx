import { createContext, useContext, useEffect, useState } from 'react';
import { useIsMobile } from 'utils/hooks';
import { StyledAlert, StyledSnackbar } from './styles';

export const SnackbarAlertContext = createContext(null);

export const useSnackbarAlert = () => useContext(SnackbarAlertContext);

export function SnackbarAlertProvider({ children }) {
  const [message, setSnackbarAlertMessage] = useState('');
  const [anchorOrigin, setSnackbarAlertAnchorOrigin] = useState({
    vertical: 'top',
    horizontal: 'center',
  });
  const [open, setSnackbarAlertOpen] = useState(false);
  const [severity, setSnackbarAlertSeverity] = useState('success');
  const [autoHideDuration, setSnackbarAlertAutoHideDuration] = useState(6000);

  const handleOnClose = () => {
    setSnackbarAlertOpen(false);
  };

  const isMobile = useIsMobile();
  useEffect(() => {
    if (isMobile) {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Wonder currently works best on desktop. Mobile coming soon :)');
      setSnackbarAlertAnchorOrigin({
        vertical: 'bottom',
        horizontal: 'center',
      });
    }
  }, [isMobile]);

  return (
    <SnackbarAlertContext.Provider
      value={{
        setSnackbarAlertMessage,
        setSnackbarAlertAnchorOrigin,
        setSnackbarAlertOpen,
        setSnackbarAlertSeverity,
        setSnackbarAlertAutoHideDuration,
      }}
    >
      <StyledSnackbar
        anchorOrigin={anchorOrigin}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleOnClose}
      >
        <StyledAlert severity={severity} icon={false}>
          {message}
        </StyledAlert>
      </StyledSnackbar>
      {children}
    </SnackbarAlertContext.Provider>
  );
}
