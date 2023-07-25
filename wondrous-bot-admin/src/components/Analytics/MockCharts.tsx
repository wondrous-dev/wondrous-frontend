import { useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import PageHeader from "components/PageHeader";
import {
  GET_CMTY_ENTITIES_COUNT,
  GET_CMTY_PRESENCE_ANALYTICS,
  GET_ONBOARDED_USERS_DATA,
  GET_QUEST_LEADERBOARD,
  GET_SUBMISSION_REPORTS,
} from "graphql/queries";
import { useContext } from "react";
import GlobalContext from "utils/context/GlobalContext";
import MessagesAndReactions from "./AnalyticsGraphs/MessagesAndReactions";
import OnboardedUsers from "./AnalyticsGraphs/OnboardedUsers";
import QuestLeaderboard from "./AnalyticsGraphs/QuestLeaderboard";
import Submissions from "./AnalyticsGraphs/Submissions";
import CardsComponent from "./Cards";
import Heatmap from "./GraphsComponent/Heatmap";

const MockCharts = () => {
  const { activeOrg } = useContext(GlobalContext);

  const cardsStats = {
    cmtyMembers: 1201,
    allTimeCmtyMembers: 1888,
    questCompletions: 100,
    allTimeQuestCompletions: 202,
    rewards: 50,
    allTimeRewards: 70,
  };

  const MESSAGES_REACTIONS_MOCK_DATA = [
    {
      date: "2023-07-19T05:26:26.621Z",
      counts: {
        discordMessage: 24,
        discordReaction: 29,
        discordInteraction: 26,
      },
    },
    {
      date: "2023-07-20T05:26:26.621Z",
      counts: {
        discordMessage: 28,
        discordReaction: 32,
        discordInteraction: 34,
      },
    },
    {
      date: "2023-07-21T05:26:26.621Z",
      counts: {
        discordMessage: 30,
        discordReaction: 32,
        discordInteraction: 34,
      },
    },
    {
      date: "2023-07-22T05:26:26.621Z",
      counts: {
        discordMessage: 26,
        discordReaction: 28,
        discordInteraction: 22,
      },
    },
    {
      date: "2023-07-23T05:26:26.621Z",
      counts: {
        discordMessage: 34,
        discordReaction: 36,
        discordInteraction: 38,
      },
    },
    {
      date: "2023-07-24T05:26:26.621Z",
      counts: {
        discordMessage: 36,
        discordReaction: 38,
        discordInteraction: 40,
      },
    },
    {
      date: "2023-07-25T05:26:26.621Z",
      counts: {
        discordMessage: 40,
        discordReaction: 42,
        discordInteraction: 44,
      },
    },
  ];

  const ONBOARDED_USERS_MOCK = [
    {
      date: "2023-07-19T05:28:07.847Z",
      total: 28,
    },
    {
      date: "2023-07-20T05:28:07.847Z",
      total: 37,
    },
    {
      date: "2023-07-21T05:28:07.847Z",
      total: 95,
    },
    {
      date: "2023-07-22T05:28:07.847Z",
      total: 6,
    },
    {
      date: "2023-07-23T05:28:07.847Z",
      total: 47,
    },
    {
      date: "2023-07-24T05:28:07.847Z",
      total: 13,
    },
    {
      date: "2023-07-25T05:28:07.847Z",
      total: 84,
    },
  ];

  const SUBS_MOCK = [
    {
      date: "2023-07-19T05:29:20.689Z",
      counts: {
        total: 30,
        approved: 4,
      },
    },
    {
      date: "2023-07-20T05:29:20.689Z",
      counts: {
        total: 36,
        approved: 22,
      },
    },
    {
      date: "2023-07-21T05:29:20.689Z",
      counts: {
        total: 29,
        approved: 26,
      },
    },
    {
      date: "2023-07-22T05:29:20.689Z",
      counts: {
        total: 3,
        approved: 7,
      },
    },
    {
      date: "2023-07-23T05:29:20.689Z",
      counts: {
        total: 49,
        approved: 19,
      },
    },
    {
      date: "2023-07-24T05:29:20.689Z",
      counts: {
        total: 48,
        approved: 17,
      },
    },
    {
      date: "2023-07-25T05:29:20.689Z",
      counts: {
        total: 9,
        approved: 27,
      },
    },
  ];

  const HEATMAP_MOCK = [
    {
      date: "2023-07-19T05:31:07.903Z",
      hour: 0,
      counts: {
        total: 89,
        active: 8,
      },
    },
    {
      date: "2023-07-20T05:31:07.903Z",
      hour: 4,
      counts: {
        total: 49,
        active: 59,
      },
    },
    {
      date: "2023-07-21T05:31:07.903Z",
      hour: 8,
      counts: {
        total: 32,
        active: 12,
      },
    },
    {
      date: "2023-07-22T05:31:07.903Z",
      hour: 12,
      counts: {
        total: 88,
        active: 88,
      },
    },
    {
      date: "2023-07-23T05:31:07.903Z",
      hour: 16,
      counts: {
        total: 58,
        active: 55,
      },
    },
    {
      date: "2023-07-24T05:31:07.903Z",
      hour: 20,
      counts: {
        total: 17,
        active: 13,
      },
    },
    {
      date: "2023-07-25T05:31:07.903Z",
      hour: 24,
      counts: {
        total: 52,
        active: 54,
      },
    },
  ];
  return (
    <>
      <PageHeader title="Analytics" withBackButton={true} />
      <Grid
        minHeight="100vh"
        sx={{
          backgroundColor: "#BAACFA",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        container
        direction="column"
        gap="42px"
        padding={{
          xs: "14px 14px 120px 14px",
          sm: "24px 56px",
        }}
      >
        <CardsComponent defaultStats={cardsStats} />
        <Grid
          display="flex"
          gap="24px"
          flexWrap="nowrap"
          flexDirection={{
            xs: "column",
            sm: "row",
          }}
        >
          <MessagesAndReactions data={MESSAGES_REACTIONS_MOCK_DATA} refetch={() => {}} loading={false} />
          <OnboardedUsers data={ONBOARDED_USERS_MOCK} refetch={() => {}} loading={false} error={null} />
        </Grid>
        <Grid
          display="flex"
          gap="24px"
          flexWrap="nowrap"
          flexDirection={{
            xs: "column",
            sm: "row",
          }}
        >
          <Grid width="100%">
            <Submissions data={SUBS_MOCK} refetch={() => {}} loading={false} />
          </Grid>
          <Heatmap data={HEATMAP_MOCK} loading={false} refetch={() => {}} />
        </Grid>
        <QuestLeaderboard />
      </Grid>
    </>
  );
};

export default MockCharts;
