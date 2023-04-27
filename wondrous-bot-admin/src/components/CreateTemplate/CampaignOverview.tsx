import { Grid } from '@mui/material';
import TextFieldComponent from 'components/Shared/TextField';
import SelectComponent from 'components/Shared/Select';
import Switch from 'components/Shared/Switch';
import ToggleComponent from 'components/Shared/Toggle';
import { CampaignOverviewTitle, Label } from './styles';
import TimeboundComponent from './TimeboundComponent';
import SingleCondition from 'components/DynamicCondition';
import useLevels from 'utils/levels/hooks';
import { useContext, useMemo } from 'react';
import GlobalContext from 'utils/context/GlobalContext';
import MaxSubmissions from './MaxSubmissions';

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
  const { activeOrg } = useContext(GlobalContext);

  const handleChange = (key, value) => {
    setQuestSettings({
      ...questSettings,
      [key]: value,
    });
  };

  const { levels } = useLevels({
    orgId: activeOrg?.id,
  });

  const levelsOptions = useMemo(() => {
    return Object.keys(levels).map((key) => ({
      label: levels[key],
      value: key,
    }));
  }, [levels]);

  const CONFIG = [
    {
      label: 'Quest Title',
      component: TextFieldComponent,
      value: questSettings.questTitle,
      componentProps: {
        multiline: false,
      },
      key: 'questTitle',
    },
    {
      label: 'Level Requirement',
      component: SelectComponent,
      value: questSettings.levelRequirement,
      componentProps: {
        options: levelsOptions,
      },
      key: 'levelRequirement',
    },
    {
      label: 'Time Bound',
      component: TimeboundComponent,
      value: {
        timeBound: questSettings.timeBound,
        startDate: questSettings.startDate,
        endDate: questSettings.endDate,
      },
      key: 'timeBound',
    },
    {
      label: 'Require Review',
      component: ToggleComponent,
      value: questSettings.requireReview,
      key: 'requireReview',
      componentProps: {
        options: REQUIRE_REVIEW_OPTIONS,
        fullWidth: true
      },
    },
    {
      label: 'Condition',
      component: SingleCondition,
      value: questSettings.requirement,
      key: 'condition',
    },
    {
      label: 'Max submissions',
      component: MaxSubmissions,
      value: !!questSettings?.maxSubmissions,
      componentProps: {
        maxSubmissions: questSettings?.maxSubmissions,
        onChange: (value) => {
          console.log('here??')
          if (!value && questSettings.maxSubmissions) {
            return handleChange('maxSubmissions', null);
          }
          return handleChange('maxSubmissions', 1);
        },
      },
      key: 'maxSubmissions',
    },

    {
      label: 'Active Quest',
      component: Switch,
      value: questSettings?.isActive,
      key: 'isActive',
    },
  ];

  return (
    <>
      {CONFIG.map(
        (
          { label, component: Component, key, componentProps = {} }: any,
          idx
        ) => {
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
                  questSettings={questSettings}
                  setQuestSettings={setQuestSettings}
                  {...componentProps}
                />
              ) : null}
            </Grid>
          );
        }
      )}
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
