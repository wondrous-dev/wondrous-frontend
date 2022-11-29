import { useQuery } from '@apollo/client';
import { PodModal } from 'components/Common/PodModal';
import CreateCollaborationModal from 'components/CreateCollaborationModal';
import { CreateEntity } from 'components/CreateEntity';
import { CreateFormModalOverlay } from 'components/CreateEntity/styles';
import CreateEntityDiscardTask from 'components/CreateEntityDiscardTask';
import CreateGrant from 'components/CreateGrant';
import DocCategoriesDialog from 'components/DocCategoriesDialog';
import {
  GET_ORG_COLLABS_FOR_ORG,
  GET_ORG_GRANTS,
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_ORG_USERS,
} from 'graphql/queries';
import { GET_ORG_DOCS_CATEGORIES } from 'graphql/queries/documents';
import sortBy from 'lodash/sortBy';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { useBoards, useProject } from 'utils/hooks';

import { ICreateButtonProps } from './CreateButton';
import { EntitiesType } from './types';

export const useCreateEntityModal = () => {
  const [entityType, setEntityType] = useState<EntitiesType>(null);
  const handleOnCloseCreateEntity = () => setEntityType(null);
  const CreateEntityModal = () => (
    <CreateEntity
      open={!!entityType}
      entityType={entityType}
      handleClose={handleOnCloseCreateEntity}
      handleCloseModal={handleOnCloseCreateEntity}
      cancel={handleOnCloseCreateEntity}
    />
  );
  return { setEntityType, CreateEntityModal };
};

export const useCollaborationModal = () => {
  const { board } = useBoards();
  const [openCollaborationModal, setCollaborationModal] = useState(false);
  const handleCreateModal = () => setCollaborationModal((prevState) => !prevState);
  const CollaborationModal = () => (
    <CreateCollaborationModal open={openCollaborationModal} onCancel={handleCreateModal} defaultOrgId={board?.orgId} />
  );
  return { CollaborationModal, handleCreateModal };
};

export const useDocCategoriesModal = () => {
  const router = useRouter();
  const { board } = useBoards();
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);
  const [docCategory, setDocCategory] = useState(null);
  const handleCreateNewCategory = () => setShowCategoriesDialog(true);
  const handleCloseCategoriesDialog = () => {
    setShowCategoriesDialog(false);
    setDocCategory({});
  };
  const DocCategoriesModal = () => (
    <DocCategoriesDialog
      open={showCategoriesDialog}
      onClose={handleCloseCategoriesDialog}
      orgName={router.query.username}
      orgId={board?.orgId}
      podId={null}
      category={docCategory}
    />
  );
  return { DocCategoriesModal, handleCreateNewCategory };
};

export const useCreateGrantModal = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const handleCreateFormModal = () => setIsCreateModalOpen((prev) => !prev);
  const toggleDiscardModal = () => setIsDiscardOpen((prev) => !prev);
  const CreateGrantModal = () => (
    <>
      <CreateEntityDiscardTask
        open={isDiscardOpen}
        onClose={setIsDiscardOpen}
        onCloseFormModal={handleCreateFormModal}
        entityType={ENTITIES_TYPES.GRANT}
      />
      <CreateFormModalOverlay open={isCreateModalOpen} onClose={toggleDiscardModal}>
        <CreateGrant
          entityType={ENTITIES_TYPES.GRANT}
          handleClose={handleCreateFormModal}
          cancel={handleCreateFormModal}
        />
      </CreateFormModalOverlay>
    </>
  );
  return { CreateGrantModal, handleCreateFormModal };
};

export const usePodModal = () => {
  const [openPodModal, setOpenPodModal] = useState(false);
  const handleSetOpenPodModal = () => setOpenPodModal((prevState) => !prevState);
  const Modal = () => <PodModal open={openPodModal} handleClose={() => setOpenPodModal(false)} />;
  return { PodModal: Modal, handleSetOpenPodModal };
};

export const useEntityCreateButtonProps = (entityType: EntitiesType): ICreateButtonProps => {
  const { setEntityType } = useProject();
  return {
    onClick: () => setEntityType(entityType),
    text: entityType,
  };
};

export const useCollaborationButtonProps = (): ICreateButtonProps => {
  const { handleCreateModal } = useProject();
  return {
    onClick: handleCreateModal,
    text: 'Collab',
  };
};

export const useDocCategoriesButtonProps = (): ICreateButtonProps => {
  const { handleCreateNewCategory } = useProject();
  return {
    onClick: handleCreateNewCategory,
    text: 'Resource',
  };
};

export const useCreateGrantButtonProps = (): ICreateButtonProps => {
  const { handleCreateFormModal } = useProject();
  return {
    onClick: handleCreateFormModal,
    text: 'Grant',
  };
};

const LIMIT = 6;

export const useGetOrgEntity = (type) => {
  const { orgData } = useProject();
  const { data } = useQuery(GET_ORG_TASK_BOARD_TASKS, {
    nextFetchPolicy: 'cache-first',
    skip: !orgData?.id,
    variables: {
      orgId: orgData?.id,
      podIds: [],
      offset: 0,
      statuses: ['created', 'in_progress', 'in_review', 'completed'],
      limit: LIMIT,
      labelId: null,
      date: null,
      types: [type],
    },
  });
  return sortBy(data?.getOrgTaskBoardTasks, ({ id }) => id).slice(0, LIMIT);
};

export const useGetOrgProposal = () => {
  const { orgData } = useProject();
  const { data } = useQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
    skip: !orgData?.id,
    variables: {
      orgId: orgData?.id,
      limit: LIMIT,
      offset: 0,
      statuses: ['open', 'closed', 'approved'],
    },
  });
  return data?.getOrgTaskBoardProposals;
};

export const useGetOrgUsers = () => {
  const { orgData } = useProject();
  const { data } = useQuery(GET_ORG_USERS, {
    skip: !orgData?.id,
    variables: {
      orgId: orgData?.id,
      limit: LIMIT,
    },
  });
  return data?.getOrgUsers;
};

export const useGetOrgDocumentCategories = () => {
  const { orgData } = useProject();
  const { data } = useQuery(GET_ORG_DOCS_CATEGORIES, {
    skip: !orgData?.id,
    variables: {
      orgId: orgData?.id,
      limit: LIMIT, // TODO: add limit to backend
    },
  });
  return data?.getOrgDocumentCategories.slice(0, LIMIT);
};

export const useGetGrantOrgBoard = () => {
  const { orgData } = useProject();
  const { data } = useQuery(GET_ORG_GRANTS, {
    skip: !orgData?.id,
    variables: {
      orgId: orgData?.id,
      limit: LIMIT,
      offset: 0,
      status: 'open',
    },
  });
  return data?.getGrantOrgBoard;
};

export const useGetOrgCollabsForOrg = () => {
  // TODO: this needs the username of child
  const { orgData } = useProject();
  const { data } = useQuery(GET_ORG_COLLABS_FOR_ORG, {
    skip: !orgData?.id,
    variables: {
      orgId: orgData?.id,
    },
  });
  return data?.getOrgCollabsForOrg;
};
