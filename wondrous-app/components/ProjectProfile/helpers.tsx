import { useQuery } from '@apollo/client';
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
  GET_ORG_USERS,
  GET_POD_GRANTS,
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_TASKS,
  GET_POD_USERS,
} from 'graphql/queries';
import { GET_ORG_DOCS_CATEGORIES, GET_POD_DOCS_CATEGORIES } from 'graphql/queries/documents';
import {
  GET_ORG_PROJECT_PAGE_BOUNTIES,
  GET_ORG_PROJECT_PAGE_MILESTONES,
  GET_ORG_PROJECT_PAGE_ORG_COLLABS,
  GET_ORG_PROJECT_PAGE_PROPOSALS,
  GET_ORG_PROJECT_PAGE_TASKS,
} from 'graphql/queries/projectPage';
import sortBy from 'lodash/sortBy';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BOUNTY_TYPE, ENTITIES_TYPES, MILESTONE_TYPE, TASK_TYPE } from 'utils/constants';
import { useBoards, useOrgBoard, useProject } from 'utils/hooks';

import { EntitiesType, ICreateButtonProps } from './types';

export const useIsOrg = () => Boolean(useOrgBoard());

export const useGetOrgPods = () => {
  const { orgId } = useBoards().board;
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
  const [openCollaborationModal, setCollaborationModal] = useState(false);
  const handleCreateModal = () => setCollaborationModal((prevState) => !prevState);
  const CollaborationModal = () => (
    <CreateCollaborationModal open={openCollaborationModal} onCancel={handleCreateModal} />
  );
  return { CollaborationModal, handleCreateModal };
};

export const useCategoriesModal = () => {
  const router = useRouter();
  const { board } = useBoards();
  const isOrg = useIsOrg();
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
      orgId={isOrg ? board?.orgId : null}
      podId={!isOrg ? board?.podId : null}
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

export const useCategoriesButtonProps = (): ICreateButtonProps => {
  const { handleCreateNewCategory } = useProject();
  return {
    onClick: handleCreateNewCategory,
    text: 'Document category',
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

const useGetPodTaskBoardTasks = (type) => {
  const { podId } = useBoards().board;
  const variables = {
    offset: 0,
    statuses: ['created', 'in_progress', 'in_review', 'completed'],
    limit: DATA_LIMIT,
    labelId: null,
    date: null,
    types: [type],
  };
  const { data: getPodTaskBoardTasks } = useQuery(GET_POD_TASK_BOARD_TASKS, {
    nextFetchPolicy: 'cache-first',
    skip: useIsOrg(),
    variables: {
      input: { ...variables, podId },
    },
  });
  return getPodTaskBoardTasks?.getPodTaskBoardTasks;
};

export const useGetProjectPageTasks = () => {
  const { orgId } = useBoards().board;
  const variables = {
    offset: 0,
    limit: DATA_LIMIT,
  };
  const { data: getOrgProjectPageTasks } = useQuery(GET_ORG_PROJECT_PAGE_TASKS, {
    nextFetchPolicy: 'cache-first',
    skip: !useIsOrg(),
    variables: {
      input: {
        ...variables,
        orgId,
      },
    },
  });
  const getPodTaskBoardTasks = useGetPodTaskBoardTasks(TASK_TYPE);
  const data = useIsOrg() ? getOrgProjectPageTasks?.getOrgProjectPageTasks : getPodTaskBoardTasks;
  return sortBy(data, ({ id }) => id);
};

export const useGetProjectPageMilestones = () => {
  const { orgId } = useBoards().board;
  const variables = {
    offset: 0,
    limit: DATA_LIMIT,
  };
  const { data: getOrgProjectPageMilestones } = useQuery(GET_ORG_PROJECT_PAGE_MILESTONES, {
    nextFetchPolicy: 'cache-first',
    skip: !useIsOrg(),
    variables: {
      input: {
        ...variables,
        orgId,
      },
    },
  });
  const getPodTaskBoardTasks = useGetPodTaskBoardTasks(MILESTONE_TYPE);
  const data = useIsOrg() ? getOrgProjectPageMilestones?.getOrgProjectPageMilestones : getPodTaskBoardTasks;
  return sortBy(data, ({ id }) => id);
};

export const useGetProjectPageBounties = () => {
  const { orgId } = useBoards().board;
  const variables = {
    offset: 0,
    limit: DATA_LIMIT,
  };
  const { data: getOrgProjectPageBounties } = useQuery(GET_ORG_PROJECT_PAGE_BOUNTIES, {
    nextFetchPolicy: 'cache-first',
    skip: !useIsOrg(),
    variables: {
      input: {
        ...variables,
        orgId,
      },
    },
  });
  const getPodTaskBoardTasks = useGetPodTaskBoardTasks(BOUNTY_TYPE);
  const data = useIsOrg() ? getOrgProjectPageBounties?.getOrgProjectPageBounties : getPodTaskBoardTasks;
  return sortBy(data, ({ id }) => id);
};

export const useGetProposal = () => {
  const { orgId, podId } = useBoards().board;
  const variables = {
    limit: DATA_LIMIT,
    offset: 0,
  };
  const { data: getOrgProjectPageProposals } = useQuery(GET_ORG_PROJECT_PAGE_PROPOSALS, {
    skip: !useIsOrg(),
    variables: {
      input: {
        ...variables,
        orgId,
      },
    },
  });
  const { data: getPodTaskBoardProposals } = useQuery(GET_POD_TASK_BOARD_PROPOSALS, {
    skip: useIsOrg(),
    variables: {
      input: {
        ...variables,
        statuses: ['open', 'closed', 'approved'],
        podId,
      },
    },
  });
  const data = useIsOrg()
    ? getOrgProjectPageProposals?.getOrgProjectPageProposals
    : getPodTaskBoardProposals?.getPodTaskBoardProposals;
  return data;
};

export const useGetUsers = () => {
  const { orgId, podId } = useBoards().board;
  const { data: getOrgUsers } = useQuery(GET_ORG_USERS, {
    skip: !useIsOrg(),
    variables: {
      orgId,
      limit: DATA_LIMIT,
    },
  });
  const { data: getPodUsers } = useQuery(GET_POD_USERS, {
    skip: useIsOrg(),
    variables: {
      podId,
      limit: DATA_LIMIT,
    },
  });
  const data = useIsOrg() ? getOrgUsers?.getOrgUsers : getPodUsers?.getPodUsers;
  return data;
};

export const useGetDocumentCategories = () => {
  const { orgId, podId } = useBoards().board;
  const { data: getOrgDocCategories } = useQuery(GET_ORG_DOCS_CATEGORIES, {
    skip: !useIsOrg(),
    variables: {
      orgId,
      limit: DATA_LIMIT, // TODO: add limit to backend
    },
  });
  const { data: getPodDocCategories } = useQuery(GET_POD_DOCS_CATEGORIES, {
    skip: useIsOrg(),
    variables: {
      podId,
      limit: DATA_LIMIT, // TODO: add limit to backend
    },
  });
  const data = useIsOrg()
    ? getOrgDocCategories?.getOrgDocumentCategories
    : getPodDocCategories?.getPodDocumentCategories;
  return data;
};

export const useGetGrantOrgBoard = () => {
  const { orgId, podId } = useBoards().board;
  const variables = {
    limit: DATA_LIMIT,
    offset: 0,
    status: 'open',
  };
  const { data: getOrgGrants } = useQuery(GET_ORG_GRANTS, {
    skip: !useIsOrg(),
    variables: {
      ...variables,
      orgId,
    },
  });
  const { data: getPodGrants } = useQuery(GET_POD_GRANTS, {
    skip: useIsOrg(),
    variables: {
      ...variables,
      podId,
    },
  });
  const data = useIsOrg() ? getOrgGrants?.getGrantOrgBoard : getPodGrants?.getGrantPodBoard;
  return data;
};

export const useGetOrgProjectPageOrgCollabs = () => {
  const { orgId } = useBoards().board;
  const { data } = useQuery(GET_ORG_PROJECT_PAGE_ORG_COLLABS, {
    skip: !orgId,
    variables: {
      input: {
        limit: DATA_LIMIT,
        offset: 0,
        orgId,
      },
    },
  });
  return data?.getOrgProjectPageOrgCollabs;
};
