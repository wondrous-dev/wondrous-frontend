import { Divider, Grid } from '@mui/material';
import { Panel, CampaignOverviewTitle } from './styles';

const PanelComponent = ({ renderHeader = undefined, renderBody, panelProps = {} }) => (
  <Panel {...panelProps}>
    {renderHeader ? (
      <>
        {renderHeader()}
        <Divider color="black" />
      </>
    ) : null}
    <Grid
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      gap="14px"
      bgcolor="white"
      padding="24px 14px"
      borderRadius="16px"
    >
      {renderBody()}
    </Grid>
  </Panel>
);

export default PanelComponent;
