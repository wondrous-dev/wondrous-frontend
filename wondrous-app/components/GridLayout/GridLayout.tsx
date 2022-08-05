import Grid from '@mui/material/Grid';

function GridLayout({ children }) {
  return (
    <Grid container spacing={1.5}>
      {children}
    </Grid>
  );
}

export default GridLayout;
