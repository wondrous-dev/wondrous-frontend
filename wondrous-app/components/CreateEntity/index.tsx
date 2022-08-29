import { FormikValues } from 'formik';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { useRouter } from 'next/router';
import { useCreateEntityContext } from 'utils/hooks';
import { useHotkeys } from 'react-hotkeys-hook';
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
  const createEntityContext = useCreateEntityContext();
  const [openChooseEntity, setOpenChooseEntity] = useState(false);
  const { isCreateEntityModalOpen: open, toggleCreateFormModal: toggleOpen } = createEntityContext;
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

  useHotkeys('shift+t', () => {
    setEntityType(ENTITIES_TYPES.TASK);
    setOpenChooseEntity(false);

    toggleOpen();
  });
  useHotkeys('shift+b', () => {
    setEntityType(ENTITIES_TYPES.BOUNTY);
    setOpenChooseEntity(false);

    toggleOpen();
  });
  useHotkeys('shift+l', () => {
    setEntityType(ENTITIES_TYPES.POD);
    setOpenChooseEntity(false);

    toggleOpen();
  });
  useHotkeys('shift+p', () => {
    setEntityType(ENTITIES_TYPES.PROPOSAL);
    setOpenChooseEntity(false);

    toggleOpen();
  });
  useHotkeys(
    'c',
    () => {
      setOpenChooseEntity(!openChooseEntity);
    },
    [openChooseEntity]
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
      open={openChooseEntity}
      onClose={() => {
        setOpenChooseEntity(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ChooseEntityToCreateModal handleClose={handleCloseModal} setEntityType={setEntityType} />
    </CreateFormModalOverlay>
  );
}

export default ChooseEntityToCreate;
