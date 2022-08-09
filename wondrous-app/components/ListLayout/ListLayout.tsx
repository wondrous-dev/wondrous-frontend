import Grid from '@mui/material/Grid';

function ListLayout({ children }) {
  return (
    <Grid container spacing={2}>
      {children}
    </Grid>
  );
}

export default ListLayout;
