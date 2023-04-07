import { Grid, Typography } from '@mui/material';
import { SharedButton } from 'components/Shared/styles';
import { Link } from 'react-router-dom';
import { pinkColors } from 'utils/theme/colors';

const QuestsPage = () => {
  return (
    <Grid
      display='flex'
      flexDirection='column'
      width='100%'
      padding='36px 56px'
      gap='36px'
    >
      <Grid display='flex' justifyContent='space-between' alignItems='center'>
        <Typography
          color='black'
          fontSize='32px'
          fontWeight={600}
          lineHeight='32px'
          fontFamily='Poppins'
        >
          Quests
        </Typography>
        <Link to="/quests/create">
        <SharedButton>New quest</SharedButton>
        </Link>
      </Grid>
      <Grid></Grid>
    </Grid>
  );
};

export default QuestsPage;
