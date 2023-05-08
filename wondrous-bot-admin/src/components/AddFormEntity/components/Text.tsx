import { Grid } from '@mui/material';
import TextField from 'components/Shared/TextField';
import { Label } from './styles';

const TextComponent = (props) => {
  return (
    <Grid display='flex' gap='8px' flexDirection='column' width="100%">
      <Label>Question / Prompt</Label>
      <TextField multiline={false} {...props} />
    </Grid>
  );
};

export default TextComponent;
