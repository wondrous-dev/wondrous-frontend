import { Grid } from '@mui/material';
import { StyledSwitch } from './styles';

const Switch = ({ onChange, value }) => {
  return (
    <Grid
      display='flex'
      alignItems='center'
      gap='10px'
      onClick={() => onChange(!value)}
      sx={{
        cursor: 'pointer',
      }}
    >
      <StyledSwitch checked={value} />
    </Grid>
  );
};

export default Switch;
