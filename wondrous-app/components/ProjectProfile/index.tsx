import Grid from '@mui/material/Grid';
import PodSection from 'components/ProjectProfile/PodSection';
import { useMemo } from 'react';
import { ProjectContext } from 'utils/contexts';

import { useCollaborationModal, useCreateEntityModal, useCreateGrantModal, useCategoriesModal } from './helpers';
import ProfileSectionsWrapper from './ProfileSectionsWrapper';

const ProjectProfile = ({ orgData }) => {
  const { setEntityType, CreateEntityModal } = useCreateEntityModal();
  const { CollaborationModal, handleCreateModal } = useCollaborationModal();
  const { DocCategoriesModal, handleCreateNewCategory } = useCategoriesModal();
  const { CreateGrantModal, handleCreateFormModal } = useCreateGrantModal();
  const projectContextValue = useMemo(
    () => ({
      setEntityType,
      handleCreateModal,
      handleCreateNewCategory,
      handleCreateFormModal,
      orgData,
    }),
    [setEntityType, handleCreateModal, handleCreateNewCategory, handleCreateFormModal, orgData]
  );
  return (
    <ProjectContext.Provider value={projectContextValue}>
      <>
        <CreateEntityModal />
        <CollaborationModal />
        <DocCategoriesModal />
        <CreateGrantModal />
        <Grid container flexDirection="column" gap="24px" paddingBottom="24px">
          <PodSection />
          <ProfileSectionsWrapper />
        </Grid>
      </>
    </ProjectContext.Provider>
  );
};

export default ProjectProfile;
