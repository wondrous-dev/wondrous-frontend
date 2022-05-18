import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { useContext } from 'react';

const useAlerts = () => {
  const {
    setSnackbarAlertMessage,
    setSnackbarAlertAnchorOrigin,
    setSnackbarAlertOpen,
    setSnackbarAlertSeverity,
    setSnackbarAlertAutoHideDuration,
  } = useContext(SnackbarAlertContext);

  const showError = (errorMsg) => {
    setSnackbarAlertMessage(errorMsg);
    setSnackbarAlertSeverity('warning');
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
