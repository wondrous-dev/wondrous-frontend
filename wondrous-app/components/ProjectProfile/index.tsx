import Grid from '@mui/material/Grid';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { ProjectContext } from 'utils/contexts';

import {
  useCollaborationModal,
  useCreateEntityModal,
  useCreateGrantModal,
  useCategoriesModal,
  useIsOrg,
} from './helpers';
import ProfileSectionsWrapper from './ProfileSectionsWrapper';

const PodSection = dynamic(() => import('./PodSection'), { ssr: false });

const ProjectProfile = () => {
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
    }),
    [setEntityType, handleCreateModal, handleCreateNewCategory, handleCreateFormModal]
  );
  return (
    <ProjectContext.Provider value={projectContextValue}>
      <>
        <CreateEntityModal />
        <CollaborationModal />
        <DocCategoriesModal />
        <CreateGrantModal />
        <Grid container flexDirection="column" gap="24px" paddingBottom="24px">
          {useIsOrg() ? <PodSection /> : null}
          <ProfileSectionsWrapper />
        </Grid>
      </>
    </ProjectContext.Provider>
  );
};

export default ProjectProfile;
