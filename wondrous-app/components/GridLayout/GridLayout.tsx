import Grid from '@mui/material/Grid';

const GridLayout = ({ children }) => {
  return (
    <Grid container spacing={1.5}>
      {children}
    </Grid>
  );
};

GridLayout.propTypes = {};

export default GridLayout;
