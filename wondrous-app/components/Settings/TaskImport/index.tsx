import React from 'react';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';

import { useRouter } from 'next/router';
import { TaskImportContainer } from './styles';

import NotionTaskImportSection from 'components/Settings/TaskImport/NotionTaskImport';
import { GithubIntegration } from '../Github';

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
