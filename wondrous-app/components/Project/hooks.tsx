import CreateCollaborationModal from 'components/CreateCollaborationModal';
import { CreateEntity } from 'components/CreateEntity';
import { useState } from 'react';

import { useBoards, useProject } from 'utils/hooks';
import { ICreateButtonProps } from './CreateButton';
import { EntitiesType } from './types';

export const useEntityCreateButtonProps = (entityType: EntitiesType): ICreateButtonProps => {
  const { setEntityType } = useProject();
  return {
    onClick: () => setEntityType(entityType),
    text: entityType,
  };
};

export const useCollabButtonProps = (): ICreateButtonProps => {
  const { setCollabModal } = useProject();
  return {
    onClick: () => setCollabModal(true),
    text: 'Collab',
  };
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
  const [openCollabModaol, setCollabModal] = useState(false);
  const handleCreateModal = () => setCollabModal((prevState) => !prevState);
  const CollaborationModal = () => (
    <CreateCollaborationModal open={openCollabModaol} onCancel={handleCreateModal} defaultOrgId={board?.orgId} />
  );
  return { CollaborationModal, setCollabModal };
};
