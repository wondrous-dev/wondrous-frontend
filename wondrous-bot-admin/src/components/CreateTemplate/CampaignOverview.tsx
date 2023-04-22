import { Box, ButtonBase, createTheme, Grid, Typography } from '@mui/material';
import TextFieldComponent from 'components/Shared/TextField';
import SelectComponent from 'components/Shared/Select';
import Switch from 'components/Shared/Switch';
import ToggleComponent from 'components/Shared/Toggle';
import { useState } from 'react';
import { CampaignOverviewTitle, Label } from './styles';
import DateRangePicker from 'components/Shared/DatePicker';
import { CustomTextField } from 'components/AddFormEntity/components/styles';
import { MONTH_DAY_FULL_YEAR } from 'utils/constants';
import TimeboundComponent from './TimeboundComponent';

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

const CampaignOverview = ({ questSettings, setQuestSettings }) => {
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
      component: TimeboundComponent,
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
      label: 'Condition',
      component: SelectComponent,
      value: questSettings.requirement,
      key: 'condition',
    },
    {
      label: 'Active Quest',
      component: Switch,
      value: questSettings?.isActive,
      key: 'isActive',
    }
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
                questSettings={questSettings}
                setQuestSettings={setQuestSettings}
              />
            ) : null}
          </Grid>
        );
      })}
    </>
  );
};

const CampaignOverviewHeader = ({ title = 'Quest Settings' }) => (
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
