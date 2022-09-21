import { useLazyQuery, useMutation } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import DropdownSelect from 'components/Common/DropdownSelect';
import {
  CreateLayoutsModalHeader,
  CreateLayoutsModalItemContainer,
  CreateLayoutsModalItemTitle,
  CreateModalOverlay,
} from 'components/CreateEntity/styles';
import { ModalBody, NotionImportButton, NotionInButtonIcon } from 'components/Settings/TaskImport/styles';
import { IMPORT_NOTION_TASK_TO_ORG } from 'graphql/mutations/integration';
import { GET_ORG_NOTION_DATABASES } from 'graphql/queries';
import React, { useEffect, useState } from 'react';

function NotionDatabaseSelect(props) {
  const { open, onClose, orgId, podId, toast, setToast } = props;

  const [importNotionTaskToOrg, { loading, error: importError }] = useMutation(IMPORT_NOTION_TASK_TO_ORG);

  const [getOrgNotionDatabases, { data: getOrgNotionDatabasesData }] = useLazyQuery(GET_ORG_NOTION_DATABASES, {
    onCompleted: (data) => {
      if (data?.getOrgNotionDatabases) {
        const options = [];
        for (let i = 0; i < data.getOrgNotionDatabases.length; i++) {
          const notionDatabase = data.getOrgNotionDatabases[i];
          const option = {
            label: notionDatabase?.title,
            value: notionDatabase?.id,
          };
          options.push(option);
        }
        setDatabaseOptions(options);
      }
    },
  });
  const [databaseOptions, setDatabaseOptions] = useState(null);
  const [selectedNotionDatabase, setSelectedNotionDatabase] = useState(null);
  const handleOnClose = () => {
    onClose();
  };
  useEffect(() => {
    if (open && orgId && !getOrgNotionDatabasesData) {
      getOrgNotionDatabases({
        variables: {
          orgId,
        },
      });
    }
  }, [open, orgId, getOrgNotionDatabasesData, getOrgNotionDatabases]);

  const handleImportClick = () => {
    if (!selectedNotionDatabase) {
      return;
    }
    importNotionTaskToOrg({
      variables: {
        orgId,
        notionDatabaseId: selectedNotionDatabase,
      },
    }).then(() => {
      setToast({ ...toast, message: `Tasks Imported successfully.`, show: true });
      onClose();
    });
  };
  return (
    <CreateModalOverlay open={open} onClose={handleOnClose}>
      <ModalBody>
        <CreateLayoutsModalHeader />
        <CreateLayoutsModalItemContainer>
          <CreateLayoutsModalItemTitle>Select Notion Databse</CreateLayoutsModalItemTitle>
          {databaseOptions && (
            <DropdownSelect
              value={selectedNotionDatabase}
              setValue={setSelectedNotionDatabase}
              labelText="Select database"
              options={databaseOptions}
              onChange={(e) => {}}
              formSelectStyle={{
                minWidth: '400px',
              }}
            />
          )}
          {loading ? (
            <CircularProgress
              sx={{
                marginTop: '24px',
              }}
            />
          ) : (
            <NotionImportButton onClick={handleImportClick}>
              <NotionInButtonIcon />
              Import
            </NotionImportButton>
          )}
        </CreateLayoutsModalItemContainer>
      </ModalBody>
    </CreateModalOverlay>
  );
}

export default NotionDatabaseSelect;
