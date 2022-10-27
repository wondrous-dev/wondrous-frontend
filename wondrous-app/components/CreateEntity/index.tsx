import CreateEntityDiscardTask from 'components/CreateEntityDiscardTask';
import { FormikValues } from 'formik';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { useGlobalContext } from 'utils/hooks';
import ChooseEntityToCreateModal from './chooseEntityToCreateModal';
import CreateEntityModal from './CreateEntityModal/index';
import CreatePodModal from './CreatePodModal';
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
    priority: string | void;
    claimPolicyRoles: [string] | null;
    shouldUnclaimOnDueDateExpiry: boolean | null;
    claimPolicy: string | null;
    githubPullRequest: {
      id: string;
      url: string;
      title: string;
    };
    orgId: string;
    snapshotId?: string;
  };
  open: Boolean;
  handleCloseModal: Function;
  isTaskProposal?: boolean;
  formValues?: FormikValues;
  parentTaskId?: string;
  privacyLevel?: string;
}

export function CreateEntity(props: ICreateEntity) {
  const { open, entityType, handleCloseModal, isTaskProposal } = props;
  const [discard, setDiscard] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const handleCloseForm = () => (formDirty ? setDiscard(true) : handleCloseModal());
  const forNewModal = [ENTITIES_TYPES.TASK, ENTITIES_TYPES.MILESTONE, ENTITIES_TYPES.BOUNTY].includes(entityType);
  const showNewModal = forNewModal || isTaskProposal;
  return (
    <>
      <CreateEntityDiscardTask
        open={discard}
        onClose={setDiscard}
        onCloseFormModal={handleCloseModal}
        entityType={entityType}
      />
      <CreateFormModalOverlay open={open} onClose={handleCloseForm}>
        {showNewModal ? <CreateEntityModal {...props} setFormDirty={setFormDirty} /> : <CreatePodModal {...props} />}
      </CreateFormModalOverlay>
    </>
  );
}

function ChooseEntityToCreate(props) {
  const globalContext = useGlobalContext();
  const { isCreateEntityModalOpen: open, toggleCreateFormModal: toggleOpen } = globalContext;
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
        isTaskProposal={entityType === ENTITIES_TYPES.PROPOSAL}
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
}

export default ChooseEntityToCreate;
