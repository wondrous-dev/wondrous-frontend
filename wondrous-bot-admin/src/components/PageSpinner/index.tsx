import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const PageSpinner = () => (
  <Grid width='100%' minHeight='100vh' minWidth='100vw' overflow='hidden' container justifyContent="center" alignItems="center">
    <CircularProgress 
    size={60}
    thickness={5}
    sx={{
        color: '#2A8D5C',
        animationDuration: '10000ms'
    }}/>
  </Grid>
);

export default PageSpinner;
