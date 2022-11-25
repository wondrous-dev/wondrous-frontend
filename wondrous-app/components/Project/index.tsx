import Grid from '@mui/material/Grid';
import ListGroup from 'components/Project/ListGroup';
import PodCards from 'components/Project/PodCards';
import { ProjectContext } from 'utils/contexts';
import { useCollaborationModal, useCreateEntityModal, useCreateGrantModal, useDocCategoriesModal } from './hooks';

const Project = () => {
  const { setEntityType, CreateEntityModal } = useCreateEntityModal();
  const { CollaborationModal, handleCreateModal } = useCollaborationModal();
  const { DocCategoriesModal, handleCreateNewCategory } = useDocCategoriesModal();
  const { CreateGrantModal, handleCreateFormModal } = useCreateGrantModal();
  const projectContextValue = {
    setEntityType,
    handleCreateModal,
    handleCreateNewCategory,
    handleCreateFormModal,
  };
  return (
    <ProjectContext.Provider value={projectContextValue}>
      <>
        <CreateEntityModal />
        <CollaborationModal />
        <DocCategoriesModal />
        <CreateGrantModal />
        <Grid container flexDirection="column" gap="24px" paddingBottom="24px">
          <PodCards pods={[]} />
          <ListGroup />
        </Grid>
      </>
    </ProjectContext.Provider>
  );
};

export default Project;
