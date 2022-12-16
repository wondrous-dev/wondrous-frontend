import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { Role } from 'types/common';
import {
  DeleteRoleConfirmationModalBody,
  DeleteRoleConfirmationModalBodyInput,
  DeleteRoleConfirmationModalBodyText,
  DeleteRoleConfirmationModalBodyWarningBox,
  DeleteRoleConfirmationModalBodyWarningBoxIcon,
  DeleteRoleConfirmationModalBodyWarningBoxText,
  DeleteRoleConfirmationModalCard,
  DeleteRoleConfirmationModalFooter,
  DeleteRoleConfirmationModalFooterButton,
  DeleteRoleConfirmationModalHeader,
  DeleteRoleConfirmationModalHeaderCloseModalIcon,
  DeleteRoleConfirmationModalHeaderText,
  DeleteRoleConfirmationModalWrapper,
} from './styles';

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  handleDeleteRole: () => void;
  roleToDelete: Role | null;
};

const DeleteRoleConfirmationModal = (props: Props) => {
  const { isOpen, handleClose, handleDeleteRole, roleToDelete } = props;

  const [deleteConfirmationInputValue, setDeleteConfirmationInputValue] = useState('');
  const [isDeletionInProgress, setIsDeletionInProgress] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDeleteConfirmationInputValue('');
      setIsDeletionInProgress(false);
    }
  }, [isOpen]);

  const roleName = roleToDelete?.name;
  const isDeleteButtonDisabled = deleteConfirmationInputValue?.trim() !== 'delete' || isDeletionInProgress;

  const handleDelete = () => {
    setIsDeletionInProgress(true);
    handleDeleteRole();
  };

  return (
    <DeleteRoleConfirmationModalWrapper open={isOpen} onClose={handleClose}>
      <DeleteRoleConfirmationModalCard>
        <DeleteRoleConfirmationModalHeader>
          <DeleteRoleConfirmationModalHeaderText>Are you ABSOLUTELY sure?</DeleteRoleConfirmationModalHeaderText>
          <DeleteRoleConfirmationModalHeaderCloseModalIcon onClick={handleClose} />
        </DeleteRoleConfirmationModalHeader>

        <DeleteRoleConfirmationModalBody>
          <DeleteRoleConfirmationModalBodyWarningBox>
            <DeleteRoleConfirmationModalBodyWarningBoxIcon />
            <DeleteRoleConfirmationModalBodyWarningBoxText>
              Unexpected bad things will happen if you don’t read this!
            </DeleteRoleConfirmationModalBodyWarningBoxText>
          </DeleteRoleConfirmationModalBodyWarningBox>
          <DeleteRoleConfirmationModalBodyText>
            This action <span>CANNOT</span> be undone. This will delete the <span>‘{roleName}’</span> role and all tasks
            created by them.
          </DeleteRoleConfirmationModalBodyText>
          <DeleteRoleConfirmationModalBodyText>Please type in ‘delete’ to confirm.</DeleteRoleConfirmationModalBodyText>
          <DeleteRoleConfirmationModalBodyInput
            placeholder="Type delete to delete this role"
            value={deleteConfirmationInputValue}
            onChange={(e) => setDeleteConfirmationInputValue(e.target.value)}
          />
        </DeleteRoleConfirmationModalBody>

        <DeleteRoleConfirmationModalFooter>
          <DeleteRoleConfirmationModalFooterButton onClick={handleClose}>
            Cancel
          </DeleteRoleConfirmationModalFooterButton>
          <DeleteRoleConfirmationModalFooterButton isPrimary disabled={isDeleteButtonDisabled} onClick={handleDelete}>
            {isDeletionInProgress && <CircularProgress size={16} />}
            {isDeletionInProgress ? 'Deleting the role...' : 'Delete this role'}
          </DeleteRoleConfirmationModalFooterButton>
        </DeleteRoleConfirmationModalFooter>
      </DeleteRoleConfirmationModalCard>
    </DeleteRoleConfirmationModalWrapper>
  );
};

export default DeleteRoleConfirmationModal;
