import { Grid, Typography } from '@mui/material';
import InfoIcon from 'components/Icons/InfoIcon';

const TypeComponent = ({ respondType }) => (
  <Grid gap='8px' display='flex' alignItems='center'>
    <InfoIcon />
    <Typography
      fontFamily='Poppins'
      fontWeight={500}
      fontSize={'13px'}
      color='#A5A5A5'
    >
      Community members are required to respond with {respondType}
    </Typography>
  </Grid>
);

export default TypeComponent;
