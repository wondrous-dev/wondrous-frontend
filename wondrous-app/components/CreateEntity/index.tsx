import { FormikValues } from 'formik';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { useRouter } from 'next/router';
import { useGlobalContext } from 'utils/hooks';
import { useHotkeys } from 'react-hotkeys-hook';
import { HOTKEYS } from 'utils/hotkeyHelper';
import ChooseEntityToCreateModal from './chooseEntityToCreateModal';
import CreatePodModal from './CreatePodModal';
import CreateEntityModal from './CreateEntityModal/index';
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
}

export function CreateEntity(props: ICreateEntity) {
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
        <CreateEntityModal {...props} />
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

  useHotkeys(HOTKEYS.CREATE_TASK, () => {
    setEntityType(ENTITIES_TYPES.TASK);
    toggleOpen();
  });
  useHotkeys(HOTKEYS.CREATE_BOUNTY, () => {
    setEntityType(ENTITIES_TYPES.BOUNTY);
    toggleOpen();
  });
  useHotkeys(HOTKEYS.CREATE_POD, () => {
    setEntityType(ENTITIES_TYPES.POD);
    toggleOpen();
  });
  useHotkeys(HOTKEYS.CREATE_PROPOSAL, () => {
    setEntityType(ENTITIES_TYPES.PROPOSAL);
    toggleOpen();
  });
  useHotkeys(
    HOTKEYS.CHOOSE_ENTITY,
    () => {
      toggleOpen();
    },
    [open, toggleOpen]
  );

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
      onClose={() => {
        toggleOpen();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ChooseEntityToCreateModal handleClose={handleCloseModal} setEntityType={setEntityType} />
    </CreateFormModalOverlay>
  );
}

export default ChooseEntityToCreate;
