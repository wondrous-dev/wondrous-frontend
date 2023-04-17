import { Box, Divider, Grid, Typography } from '@mui/material';
import TextField from 'components/Shared/TextField';
import { SharedSecondaryButton } from 'components/Shared/styles';
import { CampaignOverviewTitle } from './styles';

const RewardComponent = () => {
  return (
    <Grid container direction='column' gap='14px' justifyContent='flex-start'>
      <Grid display='flex' gap='14px' alignItems='center'>
        <Typography
          fontFamily='Poppins'
          fontStyle='normal'
          fontWeight={600}
          fontSize='13px'
          lineHeight='15px'
          color='#626262'
          whiteSpace={'nowrap'}
        >
          DeGodz Points
        </Typography>
        <TextField value={330} multiline={false} onChange={() => {}} />
      </Grid>
      <Divider color='#767676' />
      <Box>
      <SharedSecondaryButton>Add more</SharedSecondaryButton>
      </Box>
    </Grid>
  );
};

const RewardOverviewHeader = () => (
  <Grid
    padding='14px'
    bgcolor='#2A8D5C'
    sx={{
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
    }}
  >
    <CampaignOverviewTitle>Reward</CampaignOverviewTitle>
  </Grid>
);

export { RewardComponent, RewardOverviewHeader };
