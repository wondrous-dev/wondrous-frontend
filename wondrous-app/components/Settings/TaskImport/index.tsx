import NotionTaskImportSection from 'components/Settings/TaskImport/NotionTaskImport';
import { useRouter } from 'next/router';
import React from 'react';
import { HeaderBlock } from '../headerBlock';
import { SettingsWrapper } from '../settingsWrapper';
import { TaskImportContainer } from './styles';

const TaskImport = (props) => {
  const router = useRouter();
  const { orgId, podId } = router.query;

  return (
    <SettingsWrapper>
      <TaskImportContainer>
        <HeaderBlock title="Task Import" description="Import your task from other tools" />
        <NotionTaskImportSection orgId={orgId} podId={podId} />
      </TaskImportContainer>
    </SettingsWrapper>
  );
};

export default TaskImport;
