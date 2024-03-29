import { useCallback, useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import Modal from 'components/Modal';
import useAlerts from 'hooks/useAlerts';
import CSVFileDropzone from 'components/Common/CSVFileDropZone';
import { IMPORT_TASKS } from 'graphql/mutations';
import AccordionSummary from '@mui/material/AccordionSummary';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { GET_POD_BY_ID } from 'graphql/queries';
import { DEFAULT_IMPORT_FORMAT, IMPORT_FORMAT_OPTIONS, IMPORT_FORMATS, DEFAULT_TASKS_DATA } from './constants';
import {
  GenericImportTaskModalBodyExpandedViewWrapper,
  GenericImportTaskModalFooterButton,
  GenericImportTaskModalSelect,
  GenericImportTaskModalInputWrapper,
  GenericImportTaskModalLabel,
  GenericImportTaskModalLabelHelperLink,
  GenericImportTaskModalSelectMenuItem,
  GenericImportTaskModalSelectValueDisplayText,
} from './styles';
import {
  getTasksFromAsanaData,
  getTasksFromGenericData,
  getTasksFromTrelloData,
  getTasksFromDeworkData,
} from './helpers';

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
  const orgOrPodId = isOrg ? orgId : podId;
  const [getPodById, { data: podData }] = useLazyQuery(GET_POD_BY_ID);
  useEffect(() => {
    if (!isOrg && podId) {
      getPodById({
        variables: {
          podId,
        },
      });
    }
  }, [isOrg]);

  const pod = podData?.getPodById;

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
      setTasksData(DEFAULT_TASKS_DATA);
    },
    [IMPORT_FORMAT_OPTIONS, DEFAULT_TASKS_DATA]
  );

  const handleFileUpload = useCallback(
    (data) => {
      try {
        setError('');
        setTasksData(DEFAULT_TASKS_DATA);
        let formattedData;
        if (importFormat?.value === IMPORT_FORMATS.ASANA) {
          formattedData = getTasksFromAsanaData({ data, isOrg, orgOrPodId, orgId: pod?.orgId });
        }

        if (importFormat?.value === IMPORT_FORMATS.TRELLO) {
          formattedData = getTasksFromTrelloData({ data, isOrg, orgOrPodId, orgId: pod?.orgId });
        }

        if (importFormat?.value === IMPORT_FORMATS.DEWORK) {
          formattedData = getTasksFromDeworkData({ data, isOrg, orgOrPodId, orgId: pod?.orgId });
        }

        if (importFormat?.value === IMPORT_FORMATS.GENERAL) {
          formattedData = getTasksFromGenericData({ data, isOrg, orgOrPodId, orgId: pod?.orgId });
        }

        const formattedDataIdentifier = Date.now();
        setTasksData((_) => ({ tasks: formattedData, key: formattedDataIdentifier }));
      } catch (error) {
        setError(error.message);
        Sentry.captureException(error); // this is most likely user error, should we capture this?
      }
    },
    [importFormat?.value]
  );

  const handleFileRemove = useCallback(() => {
    setTasksData(DEFAULT_TASKS_DATA);
  }, [DEFAULT_TASKS_DATA]);

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
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Import Tasks"
      maxWidth={560}
      alignCenter
      footerRight={
        <Grid display="flex" alignItems="center" justifyContent="flex-end" gap="18px" bgcolor={palette.black97}>
          <GenericImportTaskModalFooterButton onClick={handleClose}>Cancel</GenericImportTaskModalFooterButton>
          <GenericImportTaskModalFooterButton isPrimary disabled={isImportButtonDisabled} onClick={handleImportTasks}>
            {isImportInProgress ? 'Importing tasks' : 'Start importing'}{' '}
            {isImportInProgress && <CircularProgress sx={{ marginLeft: '12px' }} size={16} />}
          </GenericImportTaskModalFooterButton>
        </Grid>
      }
    >
      <Grid display="flex" flexDirection="column" gap="26px" bgcolor={palette.grey900}>
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
          <AccordionSummary sx={{ display: 'none' }} />
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
                  handleFileRemove={handleFileRemove}
                  key={importFormat?.value}
                  isDisabled={isImportInProgress}
                />
              </GenericImportTaskModalInputWrapper>
              {error && (
                <Typography
                  fontFamily={typography.fontFamily}
                  fontWeight={500}
                  fontSize="12px"
                  lineHeight="14px"
                  color={palette.red400}
                  paddingLeft="4px"
                >
                  {error}
                </Typography>
              )}
            </>
          )}
        </GenericImportTaskModalBodyExpandedViewWrapper>
      </Grid>
    </Modal>
  );
}

export default GenericImportTaskModal;
