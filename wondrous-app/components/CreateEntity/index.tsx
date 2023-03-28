import CreateCollaborationModal from 'components/CreateCollaborationModal';
import CreateEntityDiscardTask from 'components/CreateEntityDiscardTask';
import CreateGrant from 'components/CreateGrant';
import { FormikValues } from 'formik';
import { useEffect, useState } from 'react';
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
  proposalVoteType?: string;
  customProposalChoices?: string[];
  isMilestone?: boolean;
}

export function CreateEntity(props: ICreateEntity) {
  const { open, entityType, handleCloseModal, isTaskProposal } = props;
  const [discard, setDiscard] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const handleCloseForm = () => (formDirty ? setDiscard(true) : handleCloseModal());
  const isTaskOrProposal = [
    ENTITIES_TYPES.TASK,
    ENTITIES_TYPES.MILESTONE,
    ENTITIES_TYPES.BOUNTY,
    ENTITIES_TYPES.PROPOSAL,
  ].includes(entityType);

  const isGrantEntity = entityType === ENTITIES_TYPES.GRANT;

  const isPodEntity = entityType === ENTITIES_TYPES.POD;

  const isCollab = entityType === ENTITIES_TYPES.COLLAB;
  return (
    <>
      <CreateEntityDiscardTask
        open={discard}
        onClose={setDiscard}
        onCloseFormModal={handleCloseModal}
        entityType={entityType}
      />
      <CreateFormModalOverlay open={open} onClose={handleCloseForm}>
        <>
          {isCollab && <CreateCollaborationModal open onCancel={handleCloseForm} />}
          {isTaskOrProposal && <CreateEntityModal {...props} setFormDirty={setFormDirty} />}
          {isPodEntity && <CreatePodModal {...props} />}
          {isGrantEntity && <CreateGrant {...props} setFormDirty={setFormDirty} />}
        </>
      </CreateFormModalOverlay>
    </>
  );
}

function ChooseEntityToCreate(props) {
  const globalContext = useGlobalContext();
  const { isCreateEntityModalOpen: open, toggleCreateFormModal: toggleOpen, pageData, setPageData } = globalContext;

  const resetEntityType = () => {
    if (pageData?.createEntityType) {
      setPageData({ ...pageData, createEntityType: undefined });
    }
  };
  const handleCloseModal = () => {
    resetEntityType();
    if (open) toggleOpen();
  };

  if (pageData?.createEntityType) {
    return (
      <CreateEntity
        entityType={pageData?.createEntityType}
        isTaskProposal={pageData?.createEntityType === ENTITIES_TYPES.PROPOSAL}
        handleCloseModal={handleCloseModal}
        open
        cancel={resetEntityType}
        handleClose={handleCloseModal}
        {...props}
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
      <ChooseEntityToCreateModal handleClose={handleCloseModal} />
    </CreateFormModalOverlay>
  );
}

export default ChooseEntityToCreate;
