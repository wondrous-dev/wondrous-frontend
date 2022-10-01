import { useCallback, useContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import useAlerts from 'hooks/useAlerts';
import CSVFileDropzone from 'components/Common/CSVFileDropZone';
import { IMPORT_TASKS } from 'graphql/mutations';
import { DEFAULT_IMPORT_FORMAT, IMPORT_FORMAT_OPTIONS, IMPORT_FORMATS } from './constants';
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
  GenericImportTaskModalWrapper,
  GenericImportTaskModalSelectMenuItem,
  GenericImportTaskModalSelectValueDisplay,
  GenericImportTaskModalSelectValueDisplayText,
  GenericImportTaskModalError,
} from './styles';
import { getTasksFromAsanaData, getTasksFromGenericData, getTasksFromTrelloData } from './helpers';

interface IGenericImportTaskModalProps {
  isOpen: boolean;
  handleClose: () => void;
  orgId?: string;
  podId?: string;
}

function GenericImportTaskModal(props: IGenericImportTaskModalProps) {
  const { isOpen = false, handleClose = () => {}, orgId, podId } = props;

  const [importFormat, setImportFormat] = useState(DEFAULT_IMPORT_FORMAT);
  const [error, setError] = useState('');

  const { showError } = useAlerts();
  const { setSnackbarAlertMessage, setSnackbarAlertOpen, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);

  const showSuccessToast = (message: string) => {
    setSnackbarAlertSeverity('success');
    setSnackbarAlertMessage(message);
    setSnackbarAlertOpen(true);
  };

  const isExpandedViewVisible = importFormat?.value;
  const isAddButtonDisabled = !importFormat?.value;
  const isOrg = !!orgId;
  const orgOrdPodId = isOrg ? orgId : podId;

  const resetStates = useCallback(() => {
    setImportFormat(DEFAULT_IMPORT_FORMAT);
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
      // const errorMessageFromGql = e.graphQLErrors[0]?.extensions?.message;
      console.log(e);
      Sentry.captureException(e);
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

        console.log({ formattedData });

        // importTasks({ variables: { input: formattedData } }); // testing be integration
      } catch (error) {
        setError(error.message);
        Sentry.captureException(error); // this is most likely user error, should we capture this?
      }
    },
    [importFormat?.value]
  );

  const renderImportFromValue = () => (
    <GenericImportTaskModalSelectValueDisplay>
      {importFormat?.icon}
      <GenericImportTaskModalSelectValueDisplayText isActive={!!importFormat?.value}>
        {importFormat?.label}
      </GenericImportTaskModalSelectValueDisplayText>
    </GenericImportTaskModalSelectValueDisplay>
  );

  return (
    <GenericImportTaskModalWrapper open={isOpen} onClose={handleClose} closeAfterTransition>
      <GenericImportTaskModalCard>
        <GenericImportTaskModalHeader>
          <GenericImportTaskModalHeaderText>Import Tasks</GenericImportTaskModalHeaderText>
          <GenericImportTaskModalHeaderCloseModalIcon onClick={handleClose} />
        </GenericImportTaskModalHeader>
        <GenericImportTaskModalBody>
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
                  <GenericImportTaskModalLabel htmlFor="upload-zone">Upload file</GenericImportTaskModalLabel>
                  <CSVFileDropzone handleFileUpload={handleFileUpload} key={importFormat?.value} />
                </GenericImportTaskModalInputWrapper>
                {error && <GenericImportTaskModalError>{error}</GenericImportTaskModalError>}
              </>
            )}
          </GenericImportTaskModalBodyExpandedViewWrapper>
        </GenericImportTaskModalBody>
        <GenericImportTaskModalFooter>
          <GenericImportTaskModalFooterButton onClick={handleClose}>Cancel</GenericImportTaskModalFooterButton>
          <GenericImportTaskModalFooterButton isPrimary disabled={isAddButtonDisabled} onClick={() => {}}>
            Start importing
          </GenericImportTaskModalFooterButton>
        </GenericImportTaskModalFooter>
      </GenericImportTaskModalCard>
    </GenericImportTaskModalWrapper>
  );
}

export default GenericImportTaskModal;
