import { FormikValues } from 'formik';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import ChooseEntityToCreateModal from './chooseEntityToCreateModal';
import CreatePodModal from './CreatePodModal';
import { CreateEntityModal } from './CreateEntityModal/index';
import EditLayoutBaseModal from './editEntityModal';
import { CreateFormModalOverlay } from './styles';

interface ICreateEntity {
  entityType: string;
  handleClose: Function;
  cancel: Function;
  existingTask?: {
    id: string;
    githubIssue: {
      id: string;
      url: string;
    };
    claimPolicyRoles: [string] | null;
    claimPolicy: string | null;
    githubPullRequest: {
      id: string;
      url: string;
      title: string;
    };
  };
  open: Boolean;
  handleCloseModal: Function;
  isTaskProposal?: boolean;
  formValues?: FormikValues;
  parentTaskId?: string;
}

export const CreateEntity = (props: ICreateEntity) => {
  const { open, entityType, handleCloseModal, isTaskProposal } = props;
  const forNewModal = [ENTITIES_TYPES.TASK, ENTITIES_TYPES.MILESTONE, ENTITIES_TYPES.BOUNTY].includes(entityType);
  if (isTaskProposal) {
    return (
      <CreateFormModalOverlay
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <EditLayoutBaseModal {...props} />
      </CreateFormModalOverlay>
    );
  }
  return (
    <CreateFormModalOverlay
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {forNewModal ? <CreateEntityModal {...props} /> : <CreatePodModal {...props} />}
    </CreateFormModalOverlay>
  );
};

const ChooseEntityToCreate = (props) => {
  const { open, toggleOpen } = props;
  const [entityType, setEntityType] = useState(undefined);
  const resetEntityType = () => {
    if (entityType) {
      setEntityType(undefined);
    }
  };
  const handleCloseModal = () => {
    resetEntityType();
    toggleOpen();
  };

  if (entityType) {
    return (
      <CreateEntity
        entityType={entityType}
        handleCloseModal={handleCloseModal}
        open={open}
        cancel={resetEntityType}
        handleClose={handleCloseModal}
      />
    );
  }

  return (
    <CreateFormModalOverlay
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ChooseEntityToCreateModal handleClose={handleCloseModal} setEntityType={setEntityType} />
    </CreateFormModalOverlay>
  );
};

export default ChooseEntityToCreate;
