import { Box, Grid, Typography } from '@mui/material';
import {
  RoundedSecondaryButton,
  SharedSecondaryButton,
} from 'components/Shared/styles';
import { useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { pinkColors } from 'utils/theme/colors';
import { CampaignOverviewHeader, CampaignOverview } from './CampaignOverview';
import PanelComponent from './PanelComponent';
import { Panel } from './styles';
import AddFormEntity from 'components/AddFormEntity';
import { TYPES } from 'utils/constants';
import { RewardComponent, RewardOverviewHeader } from './RewardComponent';
const CreateTemplate = ({ setRefValue, displaySavePanel }) => {
  const [configuration, setConfiguration] = useState([]);
  const [questSettings, setQuestSettings] = useState({
    questTitle: '',
    levelRequirement: null,
    timeBound: false,
    requireReview: false,
    requirement: null,
  });

  const handleAdd = (type) => {
    setConfiguration([
      ...configuration,
      { id: `item-${configuration.length}`, type, value: '' },
    ]);
  };

  const handleRemove = (index) => {
    const newItems = [...configuration];
    newItems.splice(index, 1);
    setConfiguration(newItems);
  };

  const handleSave = () => {
    console.log(configuration, 'CONFIGURATION');
  };

  useMemo(() => setRefValue({ handleSave }), [setRefValue, handleSave]);

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
            renderHeader={() => <CampaignOverviewHeader />}
            renderBody={() => (
              <CampaignOverview
                questSettings={questSettings}
                setQuestSettings={setQuestSettings}
              />
            )}
          />
          <PanelComponent
            renderHeader={() => <RewardOverviewHeader />}
            renderBody={() => <RewardComponent />}
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
          <AddFormEntity
            configuration={configuration}
            setConfiguration={setConfiguration}
            handleRemove={handleRemove}
          />
          <Panel
            display='flex'
            justifyContent='center'
            alignItems='center'
            flexDirection='column'
            gap='14px'
            padding='14px 24px'
          >
            <RoundedSecondaryButton onClick={() => handleAdd(TYPES.TEXT_FIELD)}>
              <AddIcon
                sx={{
                  color: 'black',
                  fontSize: '14px',
                }}
              />
            </RoundedSecondaryButton>
            <Typography
              color='black'
              fontFamily='Space Grotesk'
              fontWeight={600}
              fontSize='15px'
              lineHeight='15px'
            >
              Add new block
            </Typography>
          </Panel>
          {displaySavePanel ? (
            <Grid
              position='fixed'
              bgcolor='#FFEBDA'
              width='70%'
              bottom='5%'
              display='flex'
              justifyContent='center'
              alignItems='center'
              padding='14px'
              borderRadius='16px'
              border='1px solid #000212'
            >
              <SharedSecondaryButton onClick={handleSave}>
                Save Quest
              </SharedSecondaryButton>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CreateTemplate;
