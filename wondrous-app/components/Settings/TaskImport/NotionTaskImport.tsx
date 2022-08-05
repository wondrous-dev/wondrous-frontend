import { useLazyQuery } from '@apollo/client';
import { Snackbar } from 'components/Settings/styles';
import NotionDatabaseSelect from 'components/Settings/TaskImport/NotionDatabaseSelect';
import {
  NotionInButtonIcon,
  ConnectToNotionButton,
  LabelBlock,
  TaskImportMethodBlock,
} from 'components/Settings/TaskImport/styles';
import { GET_ORG_NOTION_WORKSPACE } from 'graphql/queries';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { LINK, NOTION_CONNECT_TYPES } from 'utils/constants';

const NOTION_CLIENT_ID = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID;
const REDIRECT_URL = `${LINK}/notion/callback`;

function NotionTaskImportSection(props) {
  const router = useRouter();
  const [openImportModal, setOpenImportModal] = useState(false);
  const { orgId, podId } = props;
  const [toast, setToast] = useState({ show: false, message: '' });

  const [getOrgNotionWorkspace, { data: getOrgNotionWorkspaceData }] = useLazyQuery(GET_ORG_NOTION_WORKSPACE, {});

  const redirectToNotionAuth = () => {
    const state = JSON.stringify({
      orgId,
      callbackType: NOTION_CONNECT_TYPES.TASK_IMPORT,
    });
    const url = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${NOTION_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&state=${state}`;
    window.open(url, '_blank').focus();
  };

  useEffect(() => {
    if (orgId && !getOrgNotionWorkspaceData) {
      getOrgNotionWorkspace({ variables: { orgId } });
    }
  }, [orgId, getOrgNotionWorkspaceData, getOrgNotionWorkspace]);

  return (
    <TaskImportMethodBlock>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
      />
      <NotionDatabaseSelect
        open={openImportModal}
        orgId={orgId}
        onClose={() => setOpenImportModal(false)}
        toast={toast}
        setToast={setToast}
      />
      <LabelBlock>Import from Notion</LabelBlock>
      {getOrgNotionWorkspaceData?.getOrgNotionWorkspace?.id && (
        <ConnectToNotionButton onClick={() => setOpenImportModal(true)}>
          <NotionInButtonIcon /> Import from workspace {getOrgNotionWorkspaceData?.getOrgNotionWorkspace?.name}
        </ConnectToNotionButton>
      )}
      {!getOrgNotionWorkspaceData?.getOrgNotionWorkspace?.id && (
        <ConnectToNotionButton onClick={redirectToNotionAuth}>
          <NotionInButtonIcon /> Connect to notion
        </ConnectToNotionButton>
      )}
    </TaskImportMethodBlock>
  );
}

export default NotionTaskImportSection;
