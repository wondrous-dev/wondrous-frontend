import { useLazyQuery, useMutation } from '@apollo/client';
import Image from 'next/image';
import { styled } from '@mui/material/styles';

import Typography from '@mui/material/Typography';

import { GET_ORG_DOCS } from 'graphql/queries/documents';
import { DELETE_ORG_DOCUMENT } from 'graphql/mutations/documents';

import DocModal from 'components/DocModal';

import { textStyles } from './DeleteDocDialogStyles';

const StyledText = styled(Typography)(textStyles);

const DeleteDocDialog = ({ open, onClose, selectedDoc, orgId }) => {
  const [getOrgDocs] = useLazyQuery(GET_ORG_DOCS, {
    variables: {
      orgId,
    },
  });

  const [deleteDocument] = useMutation(DELETE_ORG_DOCUMENT, {
    onCompleted: () => {
      getOrgDocs();
    },
  });

  const handleDelete = () => {
    deleteDocument({
      variables: {
        documentId: selectedDoc.id,
      },
    });
    onClose();
  };

  return (
    <DocModal
      open={open}
      onClose={onClose}
      onDelete={handleDelete}
      title={'Delete doc?'}
      titleIcon={<Image src="/images/icons/deleteDoc.svg" alt="folder icon" width={16} height={20} />}
    >
      <StyledText>Are you sure you want to delete {selectedDoc.title}?</StyledText>
      <StyledText>This action cannot be undone</StyledText>
    </DocModal>
  );
};

DeleteDocDialog.propTypes = {};

export default DeleteDocDialog;
