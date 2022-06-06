import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import ChooseEntityToCreateModal from './chooseEntityToCreateModal';
import CreateLayoutBaseModal from './createEntityModal';
import { CreateEntityModal } from './CreateEntityModal/index';
import { CreateFormModalOverlay } from './styles';

const CreateFormModal = (props) => {
  const { open, toggleOpen } = props;

  const [entityType, setEntityType] = useState('');

  const ModalBody = (props): JSX.Element => {
    if (entityType === '') {
      return <ChooseEntityToCreateModal {...props} />;
    }
    if ([ENTITIES_TYPES.TASK, ENTITIES_TYPES.MILESTONE, ENTITIES_TYPES.BOUNTY].includes(entityType)) {
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
        setEntityType={setEntityType}
        open={open}
        cancel={resetEntityType}
      />
    </CreateFormModalOverlay>
  );
};

export default CreateFormModal;
