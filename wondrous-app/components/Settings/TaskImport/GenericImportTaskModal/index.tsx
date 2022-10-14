import { useCallback, useContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import useAlerts from 'hooks/useAlerts';
import CSVFileDropzone from 'components/Common/CSVFileDropZone';
import { IMPORT_TASKS } from 'graphql/mutations';
import { Grid } from '@mui/material';
import palette from 'theme/palette';
import { DEFAULT_IMPORT_FORMAT, IMPORT_FORMAT_OPTIONS, IMPORT_FORMATS, DEFAULT_TASKS_DATA } from './constants';
import {
  GenericImportTaskModalBody,
  GenericImportTaskModalBodyExpandedViewInvisibleState,
  GenericImportTaskModalBodyExpandedViewWrapper,
  GenericImportTaskModalCard,
  GenericImportTaskModalFooter,
  GenericImportTaskModalFooterButton,
  GenericImportTaskModalHeader,
  GenericImportTaskModalHeaderCloseModalIcon,
  GenericImportTaskModalHeaderText,
  GenericImportTaskModalSelect,
  GenericImportTaskModalInputWrapper,
  GenericImportTaskModalLabel,
  GenericImportTaskModalLabelHelperLink,
  GenericImportTaskModalWrapper,
  GenericImportTaskModalSelectMenuItem,
  GenericImportTaskModalSelectValueDisplay,
  GenericImportTaskModalSelectValueDisplayText,
  GenericImportTaskModalError,
  GenericImportTaskModalProgressSpinner,
} from './styles';
import { getTasksFromAsanaData, getTasksFromGenericData, getTasksFromTrelloData } from './helpers';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  orgId?: string;
  podId?: string;
}

function GenericImportTaskModal(props: Props) {
  const { isOpen = false, handleClose = () => {}, orgId, podId } = props;

  const [importFormat, setImportFormat] = useState(DEFAULT_IMPORT_FORMAT);
  const [tasksData, setTasksData] = useState(DEFAULT_TASKS_DATA);
  const [isImportInProgress, setIsImportInProgress] = useState(false);
  const [error, setError] = useState('');

  const { showError } = useAlerts();
  const { setSnackbarAlertMessage, setSnackbarAlertOpen, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);

  const showSuccessToast = (message: string) => {
    setSnackbarAlertSeverity('success');
    setSnackbarAlertMessage(message);
    setSnackbarAlertOpen(true);
  };

  const isExpandedViewVisible = importFormat?.value;
  const isImportButtonDisabled = !importFormat?.value || !tasksData?.tasks?.length || isImportInProgress;
  const isOrg = !!orgId;
  const orgOrdPodId = isOrg ? orgId : podId;

  const resetStates = useCallback(() => {
    setImportFormat(DEFAULT_IMPORT_FORMAT);
    setTasksData(DEFAULT_TASKS_DATA);
    setIsImportInProgress(false);
    setError('');
  }, []);

  // reset field values on close
  useEffect(() => {
    if (!isOpen) {
      resetStates();
    }
  }, [isOpen]);

  useEffect(() => {
    setError('');
  }, [importFormat?.value]);

  const [importTasks] = useMutation(IMPORT_TASKS, {
    onCompleted: (_) => {
      showSuccessToast('Tasks imported successfully');
      resetStates();
      handleClose();
    },
    onError: (e) => {
      showError("We're facing some issues trying to import the tasks. Please try again later!", true);
      console.error(e);
      Sentry.captureException(e);
      setIsImportInProgress(false);
    },
  });

  const handleImportFormatChange = useCallback(
    (ev) => {
      const selectedImportFormat = IMPORT_FORMAT_OPTIONS.find((format) => format.value === ev.target.value);
      setImportFormat(selectedImportFormat);
    },
    [IMPORT_FORMAT_OPTIONS]
  );

  const handleFileUpload = useCallback(
    (data) => {
      try {
        setError('');
        setTasksData(DEFAULT_TASKS_DATA);
        let formattedData;
        if (importFormat?.value === IMPORT_FORMATS.ASANA) {
          formattedData = getTasksFromAsanaData(data, isOrg, orgOrdPodId);
        }

        if (importFormat?.value === IMPORT_FORMATS.TRELLO) {
          formattedData = getTasksFromTrelloData(data, isOrg, orgOrdPodId);
        }

        if (importFormat?.value === IMPORT_FORMATS.GENERAL) {
          formattedData = getTasksFromGenericData(data, isOrg, orgOrdPodId);
        }

        const formattedDataIdentifier = new Date().getTime();

        setTasksData((_) => ({ tasks: formattedData, key: formattedDataIdentifier }));
      } catch (error) {
        setError(error.message);
        Sentry.captureException(error); // this is most likely user error, should we capture this?
      }
    },
    [importFormat?.value]
  );

  const handleImportTasks = useCallback(() => {
    setIsImportInProgress(true);
    importTasks({ variables: { input: tasksData.tasks } });
  }, [tasksData.key]);

  const renderImportFromValue = () => (
    <Grid display="flex" alignItems="center" gap="8px">
      {importFormat?.icon}
      <GenericImportTaskModalSelectValueDisplayText isActive={!!importFormat?.value}>
        {importFormat?.label}
      </GenericImportTaskModalSelectValueDisplayText>
    </Grid>
  );

  return (
    <GenericImportTaskModalWrapper open={isOpen} onClose={handleClose} closeAfterTransition>
      <GenericImportTaskModalCard>
        <GenericImportTaskModalHeader>
          <GenericImportTaskModalHeaderText>Import Tasks</GenericImportTaskModalHeaderText>
          <GenericImportTaskModalHeaderCloseModalIcon onClick={handleClose} />
        </GenericImportTaskModalHeader>
        <Grid display="flex" flexDirection="column" gap="26px" padding="24px" bgcolor={palette.grey900}>
          <GenericImportTaskModalInputWrapper>
            <GenericImportTaskModalLabel htmlFor="import-format">Import format</GenericImportTaskModalLabel>
            <GenericImportTaskModalSelect
              id="import-format"
              value={importFormat}
              renderValue={renderImportFromValue}
              onChange={handleImportFormatChange}
            >
              {IMPORT_FORMAT_OPTIONS.map((format) => (
                <GenericImportTaskModalSelectMenuItem key={format.value} value={format.value}>
                  {format.icon}
                  {format.label}
                </GenericImportTaskModalSelectMenuItem>
              ))}
            </GenericImportTaskModalSelect>
          </GenericImportTaskModalInputWrapper>
          <GenericImportTaskModalBodyExpandedViewWrapper
            expanded={isExpandedViewVisible}
            TransitionProps={{ unmountOnExit: true }}
          >
            <GenericImportTaskModalBodyExpandedViewInvisibleState />
            {importFormat?.value && (
              <>
                <GenericImportTaskModalInputWrapper>
                  <GenericImportTaskModalLabel htmlFor="upload-zone">
                    Upload file {importFormat?.value === IMPORT_FORMATS.GENERAL && ' | CSV File should follow this'}
                    {importFormat?.value === IMPORT_FORMATS.GENERAL && (
                      <GenericImportTaskModalLabelHelperLink
                        href="https://docs.google.com/spreadsheets/d/1byibx7lPAhQRj2FgNevYco0e66KwXpd6PHUoBK3cyFY/edit?usp=sharing"
                        target="_blank"
                        noreferrer
                        noopener
                      >
                        format
                      </GenericImportTaskModalLabelHelperLink>
                    )}
                  </GenericImportTaskModalLabel>
                  <CSVFileDropzone
                    handleFileUpload={handleFileUpload}
                    key={importFormat?.value}
                    isDisabled={isImportInProgress}
                  />
                </GenericImportTaskModalInputWrapper>
                {error && <GenericImportTaskModalError>{error}</GenericImportTaskModalError>}
              </>
            )}
          </GenericImportTaskModalBodyExpandedViewWrapper>
        </Grid>
        <Grid
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          gap="18px"
          padding="24px"
          bgcolor={palette.black97}
        >
          <GenericImportTaskModalFooterButton onClick={handleClose}>Cancel</GenericImportTaskModalFooterButton>
          <GenericImportTaskModalFooterButton isPrimary disabled={isImportButtonDisabled} onClick={handleImportTasks}>
            {isImportInProgress ? 'Importing tasks' : 'Start importing'}{' '}
            {isImportInProgress && <GenericImportTaskModalProgressSpinner size={16} />}
          </GenericImportTaskModalFooterButton>
        </Grid>
      </GenericImportTaskModalCard>
    </GenericImportTaskModalWrapper>
  );
}

export default GenericImportTaskModal;
