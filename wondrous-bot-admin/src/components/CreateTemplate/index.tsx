import { HdrPlus, PlusOne } from '@mui/icons-material';
import { Box, Button, ButtonBase, Divider, Grid, Typography } from '@mui/material';
import { SharedButton } from 'components/Shared/styles';
import { useContext, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CreateTemplateContext from 'utils/context';
import { pinkColors } from 'utils/theme/colors';
import { CampaignOverviewHeader, CampaignOverview } from './CampaignOverview';
import PanelComponent from './PanelComponent';
import { CampaignOverviewTitle, Panel } from './styles';
import AddFormEntity from 'components/AddFormEntity';
import { CONFIG, TYPES } from 'utils/constants';
const CreateTemplate = () => {
  // const { configuration, toggleForm, addItem } = useContext(CreateTemplateContext);

  const [configuration, setConfiguration] = useState([]);

  const handleAdd = (type) => {
    setConfiguration([
      ...configuration,
      { id: `item-${configuration.length}`, type },
    ]);
  };

  const handleRemove = (index) => {
    const newItems = [...configuration];
    newItems.splice(index, 1);
    setConfiguration(newItems);
  };

  return (
    <Grid
      container
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      bgcolor={pinkColors.pink50}
      minHeight='100vh'
      padding='24px 56px'
    >
      <Grid display='flex' justifyContent='space-between' width="100%" gap="24px">
        <Box flexBasis="40%">
        <PanelComponent
          renderHeader={() => <CampaignOverviewHeader />}
          renderBody={() => <CampaignOverview />}
        />
        </Box>
        <Grid
          display='flex'
          flexDirection='column'
          justifyContent='center'
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
            <ButtonBase
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#C6BBFC',
                borderRadius: '6px',
                height: 30,
                width: 30,
              }}
              onClick={() => handleAdd(TYPES.TEXT_FIELD)}
            >
              <AddIcon
                sx={{
                  color: 'black',
                  fontSize: '14px',
                }}
              />
            </ButtonBase>
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
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CreateTemplate;
