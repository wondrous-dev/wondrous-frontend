import CreateCollaborationModal from 'components/CreateCollaborationModal';
import { CreateEntity } from 'components/CreateEntity';
import DocCategoriesDialog from 'components/DocCategoriesDialog';
import { useRouter } from 'next/router';
import { useState } from 'react';

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
