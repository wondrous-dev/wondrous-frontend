import React from 'react';

import CreateLayoutBaseModal from './createEntityModal';
import ChooseEntityToCreateModal from './chooseEntityToCreateModal';

import { CreateModalOverlay } from './styles';

const CreateFormModal = (props) => {
  const { open, toggleOpen } = props;

  const [entityType, setEntityType] = React.useState('');

  const ModalBody = entityType ? CreateLayoutBaseModal : ChooseEntityToCreateModal;

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
    <CreateModalOverlay
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
    </CreateModalOverlay>
  );
};

export default CreateFormModal;
