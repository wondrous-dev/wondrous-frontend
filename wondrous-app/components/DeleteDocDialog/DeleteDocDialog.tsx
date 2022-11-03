import { useMutation } from '@apollo/client';
import Image from 'next/legacy/image';
import { styled } from '@mui/material/styles';

import Typography from '@mui/material/Typography';

import { DELETE_DOCUMENT } from 'graphql/mutations/documents';

import DocModal from 'components/DocModal';

import { textStyles } from './DeleteDocDialogStyles';

const StyledText = styled(Typography)(textStyles);

function DeleteDocDialog({ open, onClose, selectedDoc }) {
  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    refetchQueries: ['getOrgDocs', 'getPodDocs'],
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
      title="Delete doc?"
      titleIcon={<Image src="/images/icons/deleteDoc.svg" alt="folder icon" width={16} height={20} />}
    >
      <StyledText>Are you sure you want to delete {selectedDoc.title}?</StyledText>
      <StyledText>This action cannot be undone</StyledText>
    </DocModal>
  );
}

export default DeleteDocDialog;
