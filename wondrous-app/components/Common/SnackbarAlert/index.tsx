import { createContext, useContext, useState } from 'react';
import { StyledAlert, StyledSnackbar } from './styles';

const SnackbarAlertContext = createContext(null);

export const useSnackbarAlert = () => {
  const context = useContext(SnackbarAlertContext);
  if (!context) {
    throw new Error('useSnackbarAlert must be used within a SnackbarAlertProvider');
  }
  return context;
};

export const SnackbarAlertProvider = ({ children }) => {
  const baseConfig = {
    message: '',
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
    open: false,
    severity: 'success',
    autoHideDuration: 6000,
  };
  const [snackbarAlert, setSnackbarAlert] = useState(baseConfig);
  const { message, anchorOrigin, open, severity, autoHideDuration } = snackbarAlert;
  const handleSetSnackbarAlert = (config) => {
    setSnackbarAlert({ ...baseConfig, ...config });
  };
  const handleOnClose = () => {
    setSnackbarAlert({ ...snackbarAlert, open: false });
  };
  return (
    <SnackbarAlertContext.Provider value={[handleSetSnackbarAlert]}>
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
};
