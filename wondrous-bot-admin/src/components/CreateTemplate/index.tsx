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
import { BG_TYPES, QUEST_STATUSES, TYPES } from 'utils/constants';
import { RewardComponent, RewardOverviewHeader } from './RewardComponent';
import PageWrapper from 'components/Shared/PageWrapper';
import Modal from 'components/Shared/Modal';
import { useMutation } from '@apollo/client';
import { CREATE_QUEST } from 'graphql/mutations';
import GlobalContext from 'utils/context/GlobalContext';
import { useNavigate } from 'react-router';

const CreateTemplate = ({ setRefValue, displaySavePanel }) => {
  const navigate = useNavigate();
  const [createQuest] = useMutation(CREATE_QUEST, {
    onCompleted: ({ createQuest }) => {
      navigate(`/quests/${createQuest.id}`);
    },
  });
  const { activeOrg } = useContext(GlobalContext);

  const [configuration, setConfiguration] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [questSettings, setQuestSettings] = useState({
    title: '',
    level: null,
    timeBound: false,
    maxSubmission: null,
    requireReview: false,
    isActive: false,
    startAt: null,
    endAt: null,
    questConditions: [],
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

  const handleSave = (status = null) => {
    console.log('yo');
    if (!questSettings.isActive && !isSaving) {
      return setIsSaving(true);
    }
    const {
      title,
      questConditions,
      requireReview,
      maxSubmission,
      isActive,
      startAt,
      endAt,
      level,
    } = questSettings;
    const body = {
      title,
      orgId: activeOrg.id,
      requireReview,
      maxSubmission: maxSubmission ? parseInt(maxSubmission, 10) : null,
      conditionLogic: 'and',
      questConditions,
      status:
        status || isActive ? QUEST_STATUSES.OPEN : QUEST_STATUSES.ARCHIVED,
      startAt: startAt ? startAt.toISOString() : null,
      endAt: endAt ? endAt.toISOString() : null,
      pointReward: questSettings.rewards[0].value,
      level: level ? parseInt(level, 10) : null,

      steps: configuration.reduce((acc, next, index) => {
        const step: any = {
          type: next.type,
          order: index,
          prompt: next.value?.question || next.value,
        };
        if (next.type === TYPES.MULTI_QUIZ) {
          (step.type = next.value.multiSelectValue),
            (step.options = next.value.answers.map((answer, idx) => {
              return {
                position: idx,
                text: answer.value,
                ...(next.value.withCorrectAnswers
                  ? { correct: answer.isCorrect }
                  : {}),
              };
            }));
          step.prompt = next.value.question;
        }
        return [...acc, step];
      }, []),
    };
    createQuest({
      variables: {
        input: body,
      },
    });
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
          <SharedSecondaryButton
            reverse
            onClick={() => handleSave(QUEST_STATUSES.ARCHIVED)}
          >
            No, keep inactive
          </SharedSecondaryButton>
        }
        footerRight={
          <SharedSecondaryButton
            onClick={() => handleSave(QUEST_STATUSES.OPEN)}
          >
            Yes, activate quest
          </SharedSecondaryButton>
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
