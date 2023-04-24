import { Typography, Grid, Box } from '@mui/material';
import { CustomTextField } from 'components/AddFormEntity/components/styles';
import PanelComponent from 'components/CreateTemplate/PanelComponent';
import { Label } from 'components/CreateTemplate/styles';

const ChangeOrgDetails = () => {
  return (
    <Grid padding='24px 14px' container direction='column' gap='24px'>
      <Box
        display='flex'
        flexDirection='column'
        gap='14px'
        justifyContent='flex-start'
        alignItems='flex-start'
      >
        <Label>Project Name</Label>
        <CustomTextField />
      </Box>
    </Grid>
  );
};

const OrgDetails = () => {
  return (
    <Grid flex='1'>
      <PanelComponent
        renderHeader={() => (
          <Typography
            fontFamily='Poppins'
            fontSize='12px'
            padding='14px'
            lineHeight='14px'
            fontWeight={600}
            color='#2A8D5C'
          >
            Basic Details
          </Typography>
        )}
        renderBody={ChangeOrgDetails}
      />
    </Grid>
  );
};

export default OrgDetails;
