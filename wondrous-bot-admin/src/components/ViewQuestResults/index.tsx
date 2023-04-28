import { useQuery } from '@apollo/client';
import { Box, Grid, Typography } from '@mui/material';
import {
  CampaignOverview,
  CampaignOverviewHeader,
} from 'components/CreateTemplate/CampaignOverview';
import PanelComponent from 'components/CreateTemplate/PanelComponent';
import PageWrapper from 'components/Shared/PageWrapper';
import { GET_QUEST_BY_ID } from 'graphql/queries';
import moment from 'moment';
import { useMemo } from 'react';
import { getTextForCondition } from 'utils/common';

import { BG_TYPES, MONTH_DAY_FULL_YEAR } from 'utils/constants';
import { pinkColors } from 'utils/theme/colors';
import QuestResults from './QuestResults';
import ViewCampaignOverview from './ViewCampaignOverview';

const ViewQuestResults = ({ questId }) => {
  const { data: { getQuestById } = {} } = useQuery(GET_QUEST_BY_ID, {
    variables: {
      questId,
    },
    skip: !questId,
  });

  const timeboundDate = useMemo(() => {
    const startDate = moment(getQuestById?.startDate).format(
      MONTH_DAY_FULL_YEAR
    );
    const endDate = moment(getQuestById?.endDate).format(MONTH_DAY_FULL_YEAR);
    if (!startDate && !endDate) {
      return 'No';
    }
    if (startDate && endDate) {
      return `${startDate} - ${endDate}`;
    } else if (startDate) {
      return `Starts on ${startDate}`;
    }
    return `Ends on ${endDate}`;
  }, [getQuestById?.startDate, getQuestById?.endDate]);


  if (!getQuestById) {
    return null;
  }


  const questSettings = [
    {
      label: 'Quest Title',
      value: getQuestById?.title,
      type: 'text',
    },
    {
      label: 'Level Requirement',
      value: getQuestById?.level,
      type: 'text',
    },
    {
      label: 'Time Bound',
      value: timeboundDate,
      type: 'text',
    },
    {
      label: 'Require Review',
      value: getQuestById?.requireReview,
      type: 'boolean',
    },
    {
      label: 'Condition',
      value: getTextForCondition({
        type: getQuestById?.conditions?.[0]?.type,
        name: '',
      }),
      type: 'text',
    },
    {
      label: 'Rewards',
      type: 'rewards',
      value: [
        {
          value: getQuestById?.pointReward,
          type: 'Points',
        },
      ],
    },
  ];
  return (
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
      bgType={BG_TYPES.DEFAULT}
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
            renderHeader={() => (
              <CampaignOverviewHeader title='Quest Information' />
            )}
            renderBody={() => (
              <ViewCampaignOverview questSettings={questSettings} />
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
          <QuestResults />
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default ViewQuestResults;
