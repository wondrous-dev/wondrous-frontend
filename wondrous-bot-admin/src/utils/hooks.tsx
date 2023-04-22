import { SnackbarAlertContext } from 'utils/context';
import { useContext } from 'react';

const useAlerts = () => {
  const {
    setSnackbarAlertMessage,
    setSnackbarAlertAnchorOrigin,
    setSnackbarAlertOpen,
    setSnackbarAlertSeverity,
    setSnackbarAlertAutoHideDuration,
  } = useContext(SnackbarAlertContext);

  const showError = (errorMsg, isSeverityError = false) => {
    setSnackbarAlertMessage(errorMsg);
    setSnackbarAlertSeverity(isSeverityError ? 'error' : 'warning');
    setSnackbarAlertOpen(true);
  };

  return {
    showError,
    setSnackbarAlertMessage,
    setSnackbarAlertAnchorOrigin,
    setSnackbarAlertOpen,
    setSnackbarAlertSeverity,
    setSnackbarAlertAutoHideDuration,
  };
};

export default useAlerts;
