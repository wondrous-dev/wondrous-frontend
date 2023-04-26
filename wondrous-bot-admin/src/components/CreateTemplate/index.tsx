import { Box, Grid, Typography } from '@mui/material';
import {
  RoundedSecondaryButton,
  SharedSecondaryButton,
} from 'components/Shared/styles';
import { useContext, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { CampaignOverviewHeader, CampaignOverview } from './CampaignOverview';
import PanelComponent from './PanelComponent';
import { Panel } from './styles';
import AddFormEntity from 'components/AddFormEntity';
import { BG_TYPES, OPTIONS_VALUES, TYPES } from 'utils/constants';
import { RewardComponent, RewardOverviewHeader } from './RewardComponent';
import PageWrapper from 'components/Shared/PageWrapper';
import Modal from 'components/Shared/Modal';
import { useMutation } from '@apollo/client';
import { CREATE_QUEST } from 'graphql/mutations';
import GlobalContext from 'utils/context/GlobalContext';

/*

CREATE QUEST VARS
title: String
orgId: String
mediaUploads: [{
  uploadSlug: String!,
  name: String
  type: String
}]
status: String
pointReward: Int
questConditions: [{
  type: String
  conditionData: {
    minLevel: Int
    discordRoleId: String
    discordGuildId: String
  }
}]
conditionLogic: String
steps: [{
  options: [{
    position: Int
    text: String
    correct: Boolean
  }]
  type
  order
  prompt
  required
  mediaUploads: [{
    uploadSlug: String!
    name: String
    type: String
  }]
}]
*/

const CreateTemplate = ({ setRefValue, displaySavePanel }) => {
  const [createQuest] = useMutation(CREATE_QUEST);
  const { activeOrg } = useContext(GlobalContext);

  const [configuration, setConfiguration] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [questSettings, setQuestSettings] = useState({
    questTitle: '',
    levelRequirement: null,
    timeBound: false,
    requireReview: false,
    condition: null,
    isActive: false,
    rewards: [
      {
        value: 0,
        type: 'points',
      },
    ],
  });

  const handleAdd = (type) => {
    setConfiguration([
      ...configuration,
      {
        id: `item-${configuration.length}`,
        type,
        value: '',
      },
    ]);
  };

  const handleRemove = (index) => {
    const newItems = [...configuration];
    newItems.splice(index, 1);
    setConfiguration(newItems);
  };

  const handleSave = () => {
    if (!questSettings.isActive && !isSaving) {
      return setIsSaving(true);
    }
    const body = {
      title: questSettings.questTitle,
      orgId: activeOrg.id,
      conditionLogic: 'and',
      questConditions: [
        {
          type: 'level',
          conditionData: {
            minLevel: questSettings.levelRequirement || 1,
          },
        },
      ],
      pointReward: questSettings.rewards[0].value,
      steps: configuration.reduce((acc, next, index) => {
        const step: any = {
          type: next.type,
          order: index,
        };
        if (next.type === TYPES.MULTIPLE_CHOICE) {
          step.options = next.value.answers.map((answer, idx) => {
            return {
              position: idx,
              text: answer.value,
              ...(next.value.withCorrectAnswers
                ? { correct: answer.isCorrect }
                : {}),
            };
          });
          step.prompt = next.value.question;
        } else {
          step.prompt = next.value;
        }
        return [...acc, step];
      }, []),
      // status:
    };
    createQuest({
      variables: {
        input: body,
      },
    });
    // console.log(body, 'BODY===')
    // console.log(questSettings, 'quest settings');
    // console.log(configuration, 'CONFIGURATION');
  };

  useMemo(() => setRefValue({ handleSave }), [setRefValue, handleSave]);

  return (
    <>
      <Modal
        open={isSaving}
        onClose={() => setIsSaving(false)}
        title={'Quest inactive'}
        maxWidth={600}
        footerLeft={
          <SharedSecondaryButton reverse>
            No, keep inactive
          </SharedSecondaryButton>
        }
        footerRight={
          <SharedSecondaryButton>Yes, activate quest</SharedSecondaryButton>
        }
      >
        <Typography
          fontFamily='Poppins'
          fontWeight={500}
          fontSize='14px'
          lineHeight='24px'
          color='black'
        >
          This quest has been successfully updated but is currently set to
          inactive. Do you want to set this quest to active?
        </Typography>
      </Modal>
      <PageWrapper
        containerProps={{
          direction: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          minHeight: '100vh',
          padding: {
            xs: '14px 14px 120px 14px',
            sm: '24px 56px 150px 24px',
          },
        }}
        bgType={BG_TYPES.QUESTS}
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
              renderBody={() => (
                <RewardComponent
                  rewards={questSettings.rewards}
                  setQuestSettings={setQuestSettings}
                />
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
              <RoundedSecondaryButton
                onClick={() => handleAdd(TYPES.TEXT_FIELD)}
              >
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
      </PageWrapper>
    </>
  );
};

export default CreateTemplate;
