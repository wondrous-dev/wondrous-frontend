import { useLazyQuery, useMutation } from '@apollo/client';
import { Snackbar } from 'components/Settings/styles';
import NotionDatabaseSelect from 'components/Settings/TaskImport/NotionDatabaseSelect';
import {
  NotionInButtonIcon,
  ConnectToNotionButton,
  LabelBlock,
  TaskImportMethodBlock,
  DisconnectFromNotionButton,
  DisconnectFromNotionButtonIcon,
  NotionActionsContainer,
} from 'components/Settings/TaskImport/styles';
import { GET_ORG_NOTION_WORKSPACE } from 'graphql/queries';
import { DISCONNECT_NOTION_FROM_ORG } from 'graphql/mutations';
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
  const [disconnectNotionFromOrg] = useMutation(DISCONNECT_NOTION_FROM_ORG, {
    refetchQueries: ['getOrgNotionWorkspace'],
  });

  const handleDisconnect = () => {
    disconnectNotionFromOrg({
      variables: {
        orgId,
        notionWorkspaceId: getOrgNotionWorkspaceData?.getOrgNotionWorkspace?.id,
      },
    }).then(() => {
      setToast({ ...toast, message: `Disconnected successfully.`, show: true });
    });
  };

  const redirectToNotionAuth = () => {
    const state = JSON.stringify({
      orgId,
      podId,
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
      <NotionActionsContainer>
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
        {getOrgNotionWorkspaceData?.getOrgNotionWorkspace?.id && (
          <DisconnectFromNotionButton onClick={handleDisconnect}>
            <DisconnectFromNotionButtonIcon />
            &nbsp;Disconnect from notion
          </DisconnectFromNotionButton>
        )}
      </NotionActionsContainer>
    </TaskImportMethodBlock>
  );
}

export default NotionTaskImportSection;
