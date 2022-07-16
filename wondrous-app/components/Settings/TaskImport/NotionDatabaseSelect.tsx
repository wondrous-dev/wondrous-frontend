import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';

import NotionIcon from 'components/Icons/Notion';
import { GET_ORG_NOTION_DATABASES } from 'graphql/queries';
import { IMPORT_NOTION_TASK_TO_ORG } from 'graphql/mutations/integration';
import { ErrorText } from 'components/Common';
import { CircularProgress } from '@mui/material';
import {
  CreateFormPreviewButton,
  CreateLayoutsModalHeader,
  CreateLayoutsModalItemContainer,
  CreateLayoutsModalItemTitle,
  CreateModalOverlay,
} from 'components/CreateEntity/styles';
import CloseModalIcon from '../../Icons/closeModal';
import { ModalBody } from './styles';
import DropdownSelect from 'components/Common/DropdownSelect/dropdownSelect';

const NotionDatabaseSelect = (props) => {
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
        <CreateLayoutsModalHeader></CreateLayoutsModalHeader>
        <CreateLayoutsModalItemContainer>
          <CreateLayoutsModalItemTitle>Select Notion Databse</CreateLayoutsModalItemTitle>
          {databaseOptions && (
            <DropdownSelect
              // title="Select database"
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
                marginTop: '25px',
              }}
            />
          ) : (
            <CreateFormPreviewButton
              onClick={handleImportClick}
              style={{
                marginTop: '24px',
              }}
            >
              <NotionIcon
                style={{
                  marginRight: '5px',
                }}
              />
              Import
            </CreateFormPreviewButton>
          )}
        </CreateLayoutsModalItemContainer>
      </ModalBody>
    </CreateModalOverlay>
  );
};

export default NotionDatabaseSelect;
