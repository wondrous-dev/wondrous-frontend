import { useState } from 'react';
import {
  GenericImportTasksButton,
  ImportTasksIcon,
  LabelBlock,
  TaskImportMethodBlock,
} from 'components/Settings/TaskImport/styles';
import GenericImportTaskModal from './GenericImportTaskModal';

function ImportTaskFromCSV(props) {
  const { orgId, podId } = props;

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleImportModalOpen = () => {
    setIsImportModalOpen(true);
  };

  const handleImportModalClose = () => {
    setIsImportModalOpen(false);
  };

  return (
    <TaskImportMethodBlock>
      <GenericImportTaskModal
        isOpen={isImportModalOpen}
        handleClose={handleImportModalClose}
        orgId={orgId}
        podId={podId}
      />
      <LabelBlock>Import tasks from CSV</LabelBlock>
      <GenericImportTasksButton onClick={handleImportModalOpen}>
        <ImportTasksIcon />
        Import Tasks from CSV
      </GenericImportTasksButton>
    </TaskImportMethodBlock>
  );
}

export default ImportTaskFromCSV;
