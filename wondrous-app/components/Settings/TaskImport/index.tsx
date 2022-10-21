import React from 'react';
import { useRouter } from 'next/router';
import NotionTaskImportSection from 'components/Settings/TaskImport/NotionTaskImport';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { HeaderBlock } from 'components/Settings/headerBlock';
import ImportTaskFromCSV from './ImportTaskFromCSV';
import { TaskImportContainer } from './styles';

function TaskImport(props) {
  const router = useRouter();
  const { orgId, podId } = router.query;

  return (
    <SettingsWrapper>
      <TaskImportContainer>
        <HeaderBlock title="Task Import" description="Import your task from other tools" />
        <NotionTaskImportSection orgId={orgId} podId={podId} />
        <ImportTaskFromCSV orgId={orgId} podId={podId} />
      </TaskImportContainer>
    </SettingsWrapper>
  );
}

export default TaskImport;
