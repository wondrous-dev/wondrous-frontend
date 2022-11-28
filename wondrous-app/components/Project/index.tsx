import Grid from '@mui/material/Grid';
import ListMainWrapper from 'components/Project/ListMainWrapper';
import PodCards from 'components/Project/PodCards';
import { ProjectContext } from 'utils/contexts';

import {
  useCollaborationModal,
  useCreateEntityModal,
  useCreateGrantModal,
  useDocCategoriesModal,
  usePodModal,
} from './helpers';

const Project = ({ orgData }) => {
  const { id } = orgData;
  const { setEntityType, CreateEntityModal } = useCreateEntityModal();
  const { CollaborationModal, handleCreateModal } = useCollaborationModal();
  const { DocCategoriesModal, handleCreateNewCategory } = useDocCategoriesModal();
  const { CreateGrantModal, handleCreateFormModal } = useCreateGrantModal();
  const { PodModal, handleSetOpenPodModal } = usePodModal();
  const projectContextValue = {
    setEntityType,
    handleCreateModal,
    handleCreateNewCategory,
    handleCreateFormModal,
    handleSetOpenPodModal,
    orgData,
  };
  return (
    <ProjectContext.Provider value={projectContextValue}>
      <>
        <CreateEntityModal />
        <CollaborationModal />
        <DocCategoriesModal />
        <CreateGrantModal />
        <PodModal />
        <Grid container flexDirection="column" gap="24px" paddingBottom="24px">
          <PodCards orgId={id} />
          <ListMainWrapper />
        </Grid>
      </>
    </ProjectContext.Provider>
  );
};

export default Project;
