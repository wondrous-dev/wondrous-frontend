import Grid from '@mui/material/Grid';
import { CreateEntity } from 'components/CreateEntity';
import ListGroup from 'components/Project/ListGroup';
import PodCards from 'components/Project/PodCards';
import { useState } from 'react';
import { ProjectContext } from 'utils/contexts';
import { EntitiesType } from './types';

const Project = () => {
  const [entityType, setEntityType] = useState<EntitiesType>(null);
  const handleOnCloseCreateEntity = () => setEntityType(null);
  const projectContextValue = {
    setEntityType,
  };
  return (
    <ProjectContext.Provider value={projectContextValue}>
      <CreateEntity
        open={!!entityType}
        entityType={entityType}
        handleClose={handleOnCloseCreateEntity}
        handleCloseModal={handleOnCloseCreateEntity}
        cancel={handleOnCloseCreateEntity}
      />
      <Grid container flexDirection="column" gap="24px" paddingBottom="24px">
        <PodCards pods={[]} />
        <ListGroup />
      </Grid>
    </ProjectContext.Provider>
  );
};

export default Project;
