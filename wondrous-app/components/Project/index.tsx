import Grid from '@mui/material/Grid';
import ListGroup from 'components/Project/ListGroup';
import PodCards from 'components/Project/PodCards';
import { ProjectContext } from 'utils/contexts';

import {
  useCollaborationModal,
  useCreateEntityModal,
  useCreateGrantModal,
  useDocCategoriesModal,
  usePodModal,
} from './hooks';

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
          <ListGroup />
        </Grid>
      </>
    </ProjectContext.Provider>
  );
};

export default Project;
