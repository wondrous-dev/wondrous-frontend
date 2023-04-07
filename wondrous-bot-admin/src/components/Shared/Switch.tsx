import { Grid } from '@mui/material';
import { useState } from 'react';
import { StyledSwitch } from './styles';

const Switch = ({ onChange }) => {
  const [checked, setChecked] = useState(false);
  return (
    <Grid
      display='flex'
      alignItems='center'
      gap='10px'
      onClick={() => setChecked((prev) => !prev)}
      sx={{
        cursor: 'pointer',
      }}
    >
      <StyledSwitch checked={checked} />
    </Grid>
  );
};

export default Switch;
