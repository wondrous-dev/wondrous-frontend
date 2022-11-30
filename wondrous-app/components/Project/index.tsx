import Grid from '@mui/material/Grid';
import ListMainWrapper from 'components/Project/ListMainWrapper';
import PodCards from 'components/Project/PodCards';
import { useMemo } from 'react';
import { ProjectContext } from 'utils/contexts';

import {
  useCollaborationModal,
  useCreateEntityModal,
  useCreateGrantModal,
  useDocCategoriesModal,
  usePodModal,
} from './helpers';

const Project = ({ orgData }) => {
  const { setEntityType, CreateEntityModal } = useCreateEntityModal();
  const { CollaborationModal, handleCreateModal } = useCollaborationModal();
  const { DocCategoriesModal, handleCreateNewCategory } = useDocCategoriesModal();
  const { CreateGrantModal, handleCreateFormModal } = useCreateGrantModal();
  const { PodModal, handleSetOpenPodModal } = usePodModal();
  const projectContextValue = useMemo(
    () => ({
      setEntityType,
      handleCreateModal,
      handleCreateNewCategory,
      handleCreateFormModal,
      handleSetOpenPodModal,
      orgData,
    }),
    [setEntityType, handleCreateModal, handleCreateNewCategory, handleCreateFormModal, handleSetOpenPodModal, orgData]
  );
  return (
    <ProjectContext.Provider value={projectContextValue}>
      <>
        <CreateEntityModal />
        <CollaborationModal />
        <DocCategoriesModal />
        <CreateGrantModal />
        <PodModal />
        <Grid container flexDirection="column" gap="24px" paddingBottom="24px">
          <PodCards />
          <ListMainWrapper />
        </Grid>
      </>
    </ProjectContext.Provider>
  );
};

export default Project;
