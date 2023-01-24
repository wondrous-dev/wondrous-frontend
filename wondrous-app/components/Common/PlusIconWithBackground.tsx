import Grid from '@mui/material/Grid';
import PlusIcon from 'components/Icons/plus';
import palette from 'theme/palette';

const PlusIconWithBackground = ({ width = '30px', height = '30px' }) => (
  <Grid
    container
    alignItems="center"
    justifyContent="center"
    width={width}
    height={height}
    borderRadius="100px"
    bgcolor={palette.grey900}
  >
    <PlusIcon fill={palette.blue20} />
  </Grid>
);

export default PlusIconWithBackground;
