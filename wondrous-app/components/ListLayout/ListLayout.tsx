import Grid from '@mui/material/Grid';

const ListLayout = ({ children }) => (
  <Grid container spacing={2}>
    {children}
  </Grid>
);

export default ListLayout;
