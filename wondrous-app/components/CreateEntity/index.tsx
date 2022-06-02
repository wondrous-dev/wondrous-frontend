import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import ChooseEntityToCreateModal from './chooseEntityToCreateModal';
import CreateLayoutBaseModal from './createEntityModal';
import { CreateEntityModal } from './CreateEntityModal';
import { CreateFormModalOverlay } from './styles';

const CreateFormModal = (props) => {
  const { open, toggleOpen } = props;

  const [entityType, setEntityType] = useState('');

  const ModalBody = (props): JSX.Element => {
    if (entityType === '') {
      return <ChooseEntityToCreateModal {...props} />;
    }
    if (
      entityType === ENTITIES_TYPES.TASK ||
      entityType === ENTITIES_TYPES.MILESTONE ||
      entityType === ENTITIES_TYPES.BOUNTY
    ) {
      return <CreateEntityModal {...props} />;
    }
    return <CreateLayoutBaseModal {...props} />;
  };

  const resetEntityType = () => {
    if (entityType) {
      setEntityType('');
    }
  };
  const handleCloseModal = () => {
    resetEntityType();
    toggleOpen();
  };

  return (
    <CreateFormModalOverlay
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalBody
        entityType={entityType}
        handleClose={handleCloseModal}
        resetEntityType={resetEntityType}
        setEntityType={setEntityType}
        open={open}
      />
    </CreateFormModalOverlay>
  );
};

export default CreateFormModal;
