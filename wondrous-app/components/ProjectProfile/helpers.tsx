import { useQuery } from '@apollo/client';
import PodModal from 'components/Common/PodModal';
import CreateCollaborationModal from 'components/CreateCollaborationModal';
import { CreateEntity } from 'components/CreateEntity';
import { CreateFormModalOverlay } from 'components/CreateEntity/styles';
import CreateEntityDiscardTask from 'components/CreateEntityDiscardTask';
import CreateGrant from 'components/CreateGrant';
import DocCategoriesDialog from 'components/DocCategoriesDialog';
import {
  GET_ORG_COLLABS_FOR_ORG,
  GET_ORG_GRANTS,
  GET_ORG_PODS_WITH_COUNT,
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_ORG_USERS,
} from 'graphql/queries';
import { GET_ORG_DOCS_CATEGORIES } from 'graphql/queries/documents';
import sortBy from 'lodash/sortBy';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { useBoards, useProject, useSideBar } from 'utils/hooks';

import { EntitiesType, ICreateButtonProps } from './types';

const useOrgId = () => {
  const { orgData } = useProject();
  return orgData?.id;
};

export const useGetOrgPods = () => {
  const orgId = useOrgId();
  const { data } = useQuery(GET_ORG_PODS_WITH_COUNT, {
    skip: !orgId,
    variables: {
      orgId,
    },
  });
  const { getOrgPods: pods } = data || {};
  return pods;
};

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
  const Modal = () => (
    <PodModal open={openPodModal} handleClose={() => setOpenPodModal(false)} pods={useGetOrgPods()} />
  );
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

export const DATA_LIMIT = 6;

export const useGetOrgEntity = (type) => {
  const orgId = useOrgId();
  const { data } = useQuery(GET_ORG_TASK_BOARD_TASKS, {
    nextFetchPolicy: 'cache-first',
    skip: !orgId,
    variables: {
      orgId,
      podIds: [],
      offset: 0,
      statuses: ['created', 'in_progress', 'in_review', 'completed'],
      limit: DATA_LIMIT,
      labelId: null,
      date: null,
      types: [type],
    },
  });
  return sortBy(data?.getOrgTaskBoardTasks, ({ id }) => id);
};

export const useGetOrgProposal = () => {
  const orgId = useOrgId();
  const { data } = useQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
    skip: !orgId,
    variables: {
      orgId,
      limit: DATA_LIMIT,
      offset: 0,
      statuses: ['open', 'closed', 'approved'],
    },
  });
  return data?.getOrgTaskBoardProposals;
};

export const useGetOrgUsers = () => {
  const orgId = useOrgId();
  const { data } = useQuery(GET_ORG_USERS, {
    skip: !orgId,
    variables: {
      orgId,
      limit: DATA_LIMIT,
    },
  });
  return data?.getOrgUsers;
};

export const useGetOrgDocumentCategories = () => {
  const orgId = useOrgId();
  const { data } = useQuery(GET_ORG_DOCS_CATEGORIES, {
    skip: !orgId,
    variables: {
      orgId,
      limit: DATA_LIMIT, // TODO: add limit to backend
    },
  });
  return data?.getOrgDocumentCategories;
};

export const useGetGrantOrgBoard = () => {
  const orgId = useOrgId();
  const { data } = useQuery(GET_ORG_GRANTS, {
    skip: !orgId,
    variables: {
      orgId,
      limit: DATA_LIMIT,
      offset: 0,
      status: 'open',
    },
  });
  return data?.getGrantOrgBoard;
};

export const useGetOrgCollabsForOrg = () => {
  const orgId = useOrgId();
  const { data } = useQuery(GET_ORG_COLLABS_FOR_ORG, {
    skip: !orgId,
    variables: {
      orgId,
    },
  });
  return data?.getOrgCollabsForOrg;
};

export const useHandleCollabShowAll = () => {
  const { setMinimized } = useSideBar();
  return () => setMinimized(false);
};
