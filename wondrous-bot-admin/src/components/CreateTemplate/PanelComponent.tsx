import { Divider, Grid } from '@mui/material';
import { Panel, CampaignOverviewTitle } from './styles';

const PanelComponent = ({ renderHeader, renderBody }) => (
  <Panel>
    {renderHeader()}
    <Divider color='black' />
    <Grid
      display='flex'
      flexDirection='column'
      alignItems='flex-start'
      gap='8px'
      bgcolor="white"
      padding='24px 14px'
      borderRadius="16px"
    >
      {renderBody()}
    </Grid>
  </Panel>
);

export default PanelComponent;
