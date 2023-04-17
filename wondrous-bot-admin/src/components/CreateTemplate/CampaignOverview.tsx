import { createTheme, Grid, Typography } from '@mui/material';
import TextFieldComponent from 'components/Shared/TextField';
import SelectComponent from 'components/Shared/Select';
import Switch from 'components/Shared/Switch';
import ToggleComponent from 'components/Shared/Toggle';
import { useState } from 'react';
import { CampaignOverviewTitle, Label } from './styles';

const REQUIRE_REVIEW_OPTIONS = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];

const CampaignOverview = ({questSettings, setQuestSettings}) => {

  const handleChange = (key, value) => {
    setQuestSettings({
      ...questSettings,
      [key]: value,
    });
  };

  const CONFIG = [
    {
      label: 'Quest Title',
      component: TextFieldComponent,
      value: questSettings.questTitle,
      key: 'questTitle',
    },
    {
      label: 'Level Requirement',
      component: SelectComponent,
      value: questSettings.levelRequirement,
      key: 'levelRequirement',
    },
    {
      label: 'Time Bound',
      component: Switch,
      value: questSettings.timeBound,
      key: 'timeBound',
    },
    {
      label: 'Require Review',
      component: ToggleComponent,
      value: questSettings.requireReview,
      key: 'requireReview',
      options: REQUIRE_REVIEW_OPTIONS,
    },
    {
      label: 'Requirement',
      component: SelectComponent,
      value: questSettings.requirement,
      key: 'requirement',
    },
  ];

  return (
    <>
      {CONFIG.map(({ label, component: Component, key, options }, idx) => {
        return (
          <Grid
            display='flex'
            justifyContent='flex-start'
            alignItems='center'
            width='100%'
            gap='10%'
            key={key}
          >
            <Label>{label}</Label>
            {Component ? (
              <Component
                onChange={(value) => handleChange(key, value)}
                value={questSettings[key]}
                multiline={false}
                options={options}
              />
            ) : null}
          </Grid>
        );
      })}
    </>
  );
};

const CampaignOverviewHeader = ({title = 'Quest Settings'}) => (
  <Grid
    padding='14px'
    bgcolor='#2A8D5C'
    sx={{
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
    }}
  >
    <CampaignOverviewTitle>{title}</CampaignOverviewTitle>
  </Grid>
);

export { CampaignOverview, CampaignOverviewHeader };
