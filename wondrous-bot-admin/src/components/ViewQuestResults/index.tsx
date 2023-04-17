import { Box, Grid, Typography } from '@mui/material';
import {
  CampaignOverview,
  CampaignOverviewHeader,
} from 'components/CreateTemplate/CampaignOverview';
import PanelComponent from 'components/CreateTemplate/PanelComponent';
import { pinkColors } from 'utils/theme/colors';
import QuestResults from './QuestResults';
import ViewCampaignOverview from './ViewCampaignOverview';

const ViewQuestResults = ({ resultId }) => {
  console.log(resultId, 'resultId');
  //fetch resultId
  const questSettings = [
    {
      label: 'Quest Title',
      value: 'Onboarding',
      type: 'text',
    },
    {
      label: 'Level Requirement',
      value: 3,
      type: 'text',
    },
    {
      label: 'Time Bound',
      value: false,
      type: 'boolean',
    },
    {
      label: 'Require Review',
      value: true,
      type: 'boolean',
    },
    {
      label: 'Requirement',
      value: 'Completed X*',
      type: 'text',
    },
    {
      label: 'Rewards',
      type: 'rewards',
      value: [
        {
          value: 69,
          type: 'DeGodz Points',
        },
      ],
    },
  ];
  return (
    <Grid
      container
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      bgcolor={pinkColors.pink50}
      minHeight='100vh'
      padding={{
        xs: '14px 14px 120px 14px',
        sm: '24px 56px 150px 24px',
      }}
    >
      <Grid
        display='flex'
        justifyContent='space-between'
        width='100%'
        gap='24px'
        flexDirection={{
          xs: 'column',
          sm: 'row',
        }}
      >
        <Box flexBasis='40%' display='flex' flexDirection='column' gap='24px'>
          <PanelComponent
            renderHeader={() => (
              <CampaignOverviewHeader title='Quest Information' />
            )}
            renderBody={() => (
              <ViewCampaignOverview questSettings={questSettings} />
            )}
          />
        </Box>
        <Grid
          display='flex'
          flexDirection='column'
          justifyContent='flex-start'
          gap='24px'
          alignItems='center'
          width='100%'
        >
          <QuestResults />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ViewQuestResults;
