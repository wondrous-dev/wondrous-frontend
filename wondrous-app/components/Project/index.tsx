import Grid from '@mui/material/Grid';
import ListGroup from 'components/Project/ListGroup';
import PodCards from 'components/Project/PodCards';
import { ProjectContext } from 'utils/contexts';
import { useCollaborationModal, useCreateEntityModal } from './hooks';

const Project = () => {
  const { setEntityType, CreateEntityModal } = useCreateEntityModal();
  const { CollaborationModal, setCollabModal } = useCollaborationModal();
  const projectContextValue = {
    setEntityType,
    setCollabModal,
  };
  return (
    <ProjectContext.Provider value={projectContextValue}>
      <>
        <CreateEntityModal />
        <CollaborationModal />
        <Grid container flexDirection="column" gap="24px" paddingBottom="24px">
          <PodCards pods={[]} />
          <ListGroup />
        </Grid>
      </>
    </ProjectContext.Provider>
  );
};

export default Project;
