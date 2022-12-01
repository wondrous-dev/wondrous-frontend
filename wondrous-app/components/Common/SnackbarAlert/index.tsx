import { createContext, useEffect, useMemo, useState } from 'react';
import { useIsMobile } from 'utils/hooks';
import { StyledAlert, StyledSnackbar } from './styles';

export const SnackbarAlertContext = createContext(null);

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

  const snackbarAlertValues = useMemo(
    () => ({
      setSnackbarAlertMessage,
      setSnackbarAlertAnchorOrigin,
      setSnackbarAlertOpen,
      setSnackbarAlertSeverity,
      setSnackbarAlertAutoHideDuration,
    }),
    []
  );

  return (
    <SnackbarAlertContext.Provider value={snackbarAlertValues}>
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
