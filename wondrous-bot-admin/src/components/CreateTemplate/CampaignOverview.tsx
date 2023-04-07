import { createTheme, Grid, Typography } from '@mui/material';
import SelectComponent from 'components/Shared/Select';
import Switch from 'components/Shared/Switch';
import ToggleComponent from 'components/Shared/Toggle';
import { CampaignOverviewTitle, Label } from './styles';


const CONFIG = [
  {
    label: 'Campaign Title',
    component: SelectComponent,
  },
  {
    label: 'Level Requirement',
    component: SelectComponent,
  },
  {
    label: 'Time Bound',
    component: Switch
  },
  {
    label: 'Require Review',
    component: ToggleComponent
  },
  {
    label: 'Requirement',
    component: SelectComponent
  },
  {
    label: 'Reward',
  },
];

const CampaignOverview = () => {
  return (
    <>
      {CONFIG.map(({ label, component: Component }, idx) => {
        return (
          <Grid
            display='flex'
            justifyContent='flex-start'
            alignItems='center'
            width='100%'
            gap='10%'
          >
            <Label>{label}</Label>
            {Component ? (
              <Component onChange={(val) => console.log(val)} />
            ) : null}
          </Grid>
        );
      })}
    </>
  );
};

const CampaignOverviewHeader = () => (
  <Grid padding="14px" bgcolor="#2A8D5C" sx={{
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px'
  }}>
    <CampaignOverviewTitle>Quest Settings</CampaignOverviewTitle>
  </Grid>
);

export { CampaignOverview, CampaignOverviewHeader };
