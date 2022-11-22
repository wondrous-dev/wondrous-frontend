import Grid from '@mui/material/Grid';
import ListGroup from 'components/Project/ListGroup';
import PodCards from 'components/Project/PodCards';

const Project = () => (
  <Grid container flexDirection="column" gap="24px" paddingBottom="24px">
    <PodCards pods={[]} />
    <ListGroup />
  </Grid>
);

export default Project;
