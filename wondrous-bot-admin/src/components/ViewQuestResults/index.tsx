import { useQuery, useLazyQuery } from "@apollo/client";
import { Box, Grid } from "@mui/material";
import { CampaignOverviewHeader } from "components/CreateTemplate/CampaignOverview";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import PageWrapper from "components/Shared/PageWrapper";
import {
  GET_CMTY_ORG_DISCORD_CONFIG,
  GET_QUEST_BY_ID,
  GET_QUEST_SUBMISSION_STATS,
  GET_SUBMISSIONS_FOR_QUEST,
} from "graphql/queries";
import { GET_GUILD_DISCORD_CHANNELS, GET_ORG_DISCORD_ROLES } from "graphql/queries/discord";
import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import apollo from "services/apollo";
import { getTextForCondition } from "utils/common";

import {
  BG_TYPES,
  LIMIT,
  MONTH_DAY_FULL_YEAR,
  CONDITION_TYPES,
  QUEST_STATUSES,
  QUEST_SUBMISSION_STATUS,
} from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";
import QuestResults from "./QuestResults";
import ViewCampaignOverview from "./ViewCampaignOverview";
import PublishQuestCardBody from "./PublishQuestCardBody";
import ViewRewards from "./ViewRewards";
import { StyledViewQuestResults } from "./styles";

const ViewQuestResults = ({ quest, rewards }) => {
  const { activeOrg } = useContext(GlobalContext);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(QUEST_SUBMISSION_STATUS.IN_REVIEW);
  const { data: orgDiscordConfig, error: getDiscordConfigError } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });
  const [questSettingsConditions, setQuestSettingsConditions] = useState([]);
  const [getGuildDiscordChannels, { data: guildDiscordChannelsData }] = useLazyQuery(GET_GUILD_DISCORD_CHANNELS);
  const guildId = orgDiscordConfig?.getCmtyOrgDiscordConfig?.guildId;
  const guildDiscordChannels = guildDiscordChannelsData?.getAvailableChannelsForDiscordGuild;
  const existingNotificationChannelId =
    orgDiscordConfig?.getCmtyOrgDiscordConfig?.additionalData?.notificationChannelId;
  const [getSubmissionsForQuest, { data: submissionsData, refetch, fetchMore, previousData }] = useLazyQuery(
    GET_SUBMISSIONS_FOR_QUEST,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        questId: quest?.id,
        status: filter,
        limit: LIMIT,
        offset: 0,
      },
    }
  );

  useEffect(() => {
    if (quest?.id && filter && !previousData) {
      getSubmissionsForQuest({
        variables: {
          questId: quest?.id,
          status: filter,
          limit: LIMIT,
          offset: 0,
        },
      }).then(() => setLoading(false));
    }
  }, [quest?.id, filter, previousData]);

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
      if (data?.getQuestSubmissions?.length < LIMIT) {
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

  const handleFilterChange = (filter, value) => {
    if (filter === value) return;
    setLoading(true);
    setFilter(value);
    refetch({
      questId: quest?.id,
      status: value,
    }).then(({ data }) => {
      setLoading(false);
      setHasMore(data?.getQuestSubmissions?.length >= LIMIT);
    });
  };

  const timeboundDate = useMemo(() => {
    const startDate = quest?.startAt ? moment(quest?.startAt).format(MONTH_DAY_FULL_YEAR) : null;
    const endDate = quest?.endAt ? moment(quest?.endAt).format(MONTH_DAY_FULL_YEAR) : null;
    if (!startDate && !endDate) {
      return { type: "boolean", value: "" };
    }
    if (startDate && endDate) {
      return { type: "text", value: `${startDate} - ${endDate}` };
    } else if (startDate) {
      return { type: "text", value: `Starts on ${startDate}` };
    }
    return { type: "text", value: `Ends on ${endDate}` };
  }, [quest?.startAt, quest?.endAt]);

  const getNameForCondition = async (condition) => {
    if (condition.type === CONDITION_TYPES.DISCORD_ROLE) {
      const { data } = await apollo.query({
        query: GET_ORG_DISCORD_ROLES,
        variables: {
          orgId: activeOrg?.id,
        },
      });
      const allRoles = data?.getCmtyOrgDiscordRoles?.map((role) => role.roles).flat();
      return allRoles.find((item) => item.id === condition.conditionData?.discordRoleId)?.name;
    }
    if (condition.type === CONDITION_TYPES.QUEST) {
      const { data } = await apollo.query({
        query: GET_QUEST_BY_ID,
        variables: {
          questId: condition.conditionData?.questId,
        },
      });
      return data?.getQuestById?.title;
    }
    return null;
  };

  const setQuestConditionsAsync = async (questConditions) => {
    const results = await Promise.all(
      questConditions.map(async (item) => {
        const result = await getNameForCondition(item);
        return getTextForCondition({
          type: item?.type,
          name: result,
          exclusiveQuest: item?.conditionData?.exclusiveQuest,
        });
      })
    );
    setQuestSettingsConditions(results);
  };

  useEffect(() => {
    if (guildId) {
      // fetch all guild channels
      getGuildDiscordChannels({
        variables: {
          guildId,
        },
      });
    }
  }, [guildId]);
  useEffect(() => {
    if (quest?.conditions?.length > 0 && quest?.conditions?.length !== questSettingsConditions?.length) {
      setQuestConditionsAsync(quest?.conditions);
    }
  }, [quest?.conditions?.length]);

  const submissions = useMemo(() => {
    if (loading || !submissionsData?.getQuestSubmissions?.length || !quest) return [];
    return submissionsData?.getQuestSubmissions?.map((submission) => ({
      user:
        submission?.creator?.username || submission?.creator?.discordUsername || submission?.creator?.telegramUsername,
      pointReward: quest?.pointReward,
      stepsData: submission?.stepsData,
      steps: quest?.steps,
      id: submission?.id,
      approvedAt: submission?.approvedAt,
      rejectedAt: submission?.rejectedAt,
      createdAt: submission?.createdAt,
    }));
  }, [submissionsData?.getQuestSubmissions, loading, quest]);

  if (!quest) {
    return null;
  }

  const levelText = quest?.isOnboarding ? "None - Onboarding Quest" : quest?.level;
  const sections = [
    {
      settings: [
        { label: "Quest Title", value: quest?.title, type: "titleOrDescription" },
        { label: "Description", value: quest?.description, type: "titleOrDescription" },
      ],
      settingsLayout: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "14px",
      },
    },
    {
      settings: [
        {
          label: "Level Requirement",
          value: levelText,
          type: quest.isOnboarding ? "text" : "level",
        },
        {
          label: "Require Review",
          value: quest?.requireReview,
          type: "boolean",
        },
        { label: "Active Quest", value: quest?.status === QUEST_STATUSES.OPEN, type: "boolean" },
      ],
    },

    {
      settings: [
        {
          label: "Category",
          value: quest?.category || "None",
          type: "text",
        },
        {
          label: "Max Submissions",
          value: quest?.maxSubmission || "Unlimited",
          type: "text",
        },
        {
          label: "Max Approvals",
          value: quest?.maxApproval || "Unlimited",
          type: "text",
        },
        {
          label: "Time Bound",
          ...timeboundDate,
        },
        {
          label: "Daily submission",
          value: quest?.submissionCooldownPeriod ? "Yes" : "No",
          type: "text",
        },
        {
          label: "Conditions",
          value: questSettingsConditions?.length > 0 ? questSettingsConditions : "None",
          type: questSettingsConditions?.length > 0 ? "questConditions" : "text",
        },
      ],
      showBorder: false,
    },
  ];
  return (
    <PageWrapper
      containerProps={{
        direction: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "100vh",
        padding: {
          xs: "14px 14px 120px 14px",
          sm: "24px 56px 150px 24px",
        },
      }}
      bgType={BG_TYPES.DEFAULT}
    >
      <Grid
        display="flex"
        justifyContent="space-between"
        width="100%"
        gap="24px"
        flexDirection={{
          xs: "column",
          md: "row",
        }}
      >
        <Box flexBasis="40%" display="flex" flexDirection="column" gap="24px">
          <PanelComponent
            renderHeader={() => <CampaignOverviewHeader title="Quest Information" />}
            renderBody={() => (
              <>
                {quest?.maxedAt ? (
                  <Box paddingBottom="10px">
                    <StyledViewQuestResults
                      bgcolor="#E8E8E8"
                      $outlineColor="transparent"
                      color="#828282"
                      style={{
                        position: "relative",
                      }}
                    >
                      Maximum approvals reached
                    </StyledViewQuestResults>
                  </Box>
                ) : null}

                <ViewCampaignOverview sections={sections} />
              </>
            )}
          />
          <PanelComponent renderHeader={null} renderBody={() => <ViewRewards rewards={rewards} />} />
          <PanelComponent
            renderHeader={() => <CampaignOverviewHeader title="Send quest notification" />}
            renderBody={() => (
              <PublishQuestCardBody
                guildDiscordChannels={guildDiscordChannels}
                quest={quest}
                orgId={activeOrg?.id}
                existingNotificationChannelId={existingNotificationChannelId}
              />
            )}
          />
        </Box>
        <Grid
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          gap="24px"
          alignItems="center"
          width="100%"
        >
          <QuestResults
            submissions={submissions}
            stats={submissionStats?.getQuestSubmissionStats}
            handleFilterChange={handleFilterChange}
            filter={filter}
            fetchMore={handleFetchMore}
            loading={loading}
            hasMore={hasMore}
            quest={quest}
            hasFetched={!!submissionsData}
          />
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default ViewQuestResults;
