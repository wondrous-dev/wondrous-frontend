import { useQuery } from '@apollo/client';
import { Box, Grid, Typography } from '@mui/material';
import {
  CampaignOverview,
  CampaignOverviewHeader,
} from 'components/CreateTemplate/CampaignOverview';
import PanelComponent from 'components/CreateTemplate/PanelComponent';
import PageWrapper from 'components/Shared/PageWrapper';
import {
  GET_QUESTS_FOR_ORG,
  GET_QUEST_BY_ID,
  GET_QUEST_SUBMISSION_STATS,
  GET_SUBMISSIONS_FOR_QUEST,
} from 'graphql/queries';
import { GET_ORG_DISCORD_ROLES } from 'graphql/queries/discord';
import moment from 'moment';
import { useContext, useEffect, useMemo, useState } from 'react';
import apollo from 'services/apollo';
import { getTextForCondition } from 'utils/common';

import {
  BG_TYPES,
  LIMIT,
  MONTH_DAY_FULL_YEAR,
  QUEST_CONDITION_TYPES,
  QUEST_SUBMISSION_STATUS,
} from 'utils/constants';
import GlobalContext from 'utils/context/GlobalContext';
import QuestResults from './QuestResults';
import ViewCampaignOverview from './ViewCampaignOverview';

const ViewQuestResults = ({ quest }) => {
  const { activeOrg } = useContext(GlobalContext);
  const [conditionName, setConditionName] = useState(null);

  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState(QUEST_SUBMISSION_STATUS.IN_REVIEW);

  const {
    data: submissionsData,
    refetch,
    fetchMore,
  } = useQuery(GET_SUBMISSIONS_FOR_QUEST, {
    variables: {
      questId: quest?.id,
      status: filter,
      limit: LIMIT,
      offset: 0,
    },
    skip: !quest?.id || !filter,
  });

  const handleFetchMore = () => {
    const currentLength = submissionsData?.getQuestSubmissions?.length;
    if (!hasMore || !currentLength) return;
    if (currentLength < LIMIT) {
      setHasMore(false);
      return;
    }
    fetchMore({
      variables: {
        questId: quest?.id,
        status: filter,
        offset: submissionsData?.getQuestSubmissions?.length,
        limit: LIMIT,
      },
    }).then(({ data }) => {
      if (data?.getQuestSubmissions?.length <= LIMIT) {
        setHasMore(false);
      }
    });
  };
  const { data: submissionStats } = useQuery(GET_QUEST_SUBMISSION_STATS, {
    variables: {
      questId: quest?.id,
    },
    skip: !quest?.id,
  });

  const handleFilterChange = (value) => {
    if (filter === value) return;

    refetch({
      questId: quest?.id,
      status: value,
    });
    setFilter(value);
  };

  const timeboundDate = useMemo(() => {
    const startDate = moment(quest?.startDate).format(MONTH_DAY_FULL_YEAR);
    const endDate = moment(quest?.endDate).format(MONTH_DAY_FULL_YEAR);
    if (!startDate && !endDate) {
      return 'No';
    }
    if (startDate && endDate) {
      return `${startDate} - ${endDate}`;
    } else if (startDate) {
      return `Starts on ${startDate}`;
    }
    return `Ends on ${endDate}`;
  }, [quest?.startDate, quest?.endDate]);

  const getNameForCondition = async () => {
    if (quest?.conditions?.[0]?.type === QUEST_CONDITION_TYPES.DISCORD_ROLE) {
      const { data } = await apollo.query({
        query: GET_ORG_DISCORD_ROLES,
        variables: {
          orgId: activeOrg?.id,
        },
      });
      const allRoles = data?.getCmtyOrgDiscordRoles
        ?.map((role) => role.roles)
        .flat();
      return allRoles.find(
        (item) =>
          item.id === quest?.conditions?.[0]?.conditionData?.discordRoleId
      )?.name;
    }
    if (quest?.conditions?.[0]?.type === QUEST_CONDITION_TYPES.QUEST) {
      const { data } = await apollo.query({
        query: GET_QUEST_BY_ID,
        variables: {
          questId: quest?.conditions?.[0]?.conditionData?.questId,
        },
      });
      return data?.getQuestById?.title;
    }
    return null;
  };

  useEffect(() => {
    const getName = async () => {
      const name = await getNameForCondition();
      setConditionName(name);
    };
    getName();
  }, [quest?.conditions]);

  if (!quest) {
    return null;
  }

  const submissions = submissionsData?.getQuestSubmissions?.map(
    (submission) => ({
      user:
        submission?.creator?.username || submission?.creator?.discordUsername,
      pointReward: quest?.pointReward,
      stepsData: submission?.stepsData,
      steps: quest?.steps,
      id: submission?.id,
      approvedAt: submission?.approvedAt,
      rejectedAt: submission?.rejectedAt,
    })
  );

  const questSettings = [
    {
      label: 'Quest Title',
      value: quest?.title,
      type: 'text',
    },
    {
      label: 'Level Requirement',
      value: quest?.level || 'No Level Requirement',
      type: 'text',
    },
    {
      label: 'Time Bound',
      value: timeboundDate,
      type: 'text',
    },
    {
      label: 'Require Review',
      value: quest?.requireReview,
      type: 'boolean',
    },
    {
      label: 'Condition',
      value:
        getTextForCondition({
          type: quest?.conditions?.[0]?.type,
          name: conditionName,
        }) || 'No Condition',
      type: 'text',
    },
    {
      label: 'Rewards',
      type: 'rewards',
      value: [
        {
          value: quest?.pointReward,
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
          <QuestResults
            submissions={submissions}
            stats={submissionStats?.getQuestSubmissionStats}
            handleFilterChange={handleFilterChange}
            filter={filter}
            fetchMore={handleFetchMore}
            hasMore={hasMore}
          />
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default ViewQuestResults;
