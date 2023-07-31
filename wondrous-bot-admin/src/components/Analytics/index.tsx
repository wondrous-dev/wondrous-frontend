import { useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import PageHeader from "components/PageHeader";
import {
  GET_CMTY_ENTITIES_COUNT,
  GET_CMTY_PRESENCE_ANALYTICS,
  GET_ONBOARDED_USERS_DATA,
  GET_QUESTS_FOR_ORG,
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

const AnalyticsComponent = () => {
  const { activeOrg } = useContext(GlobalContext);

  const {
    data: submissionReports,
    refetch: submissionRefetch,
    loading: submissionLoading,
  } = useQuery(GET_SUBMISSION_REPORTS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });

  const { data, refetch, loading } = useQuery(GET_CMTY_ENTITIES_COUNT, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    skip: !activeOrg?.id,
    variables: {
      orgId: activeOrg?.id,
    },
  });

  const {
    data: presenceData,
    refetch: presenceRefetch,
    loading: presenceLoading,
  } = useQuery(GET_CMTY_PRESENCE_ANALYTICS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    skip: !activeOrg?.id,
    variables: {
      orgId: activeOrg?.id,
    },
  });

  const {
    data: onboardedUsersData,
    refetch: onboardedUsersRefetch,
    loading: onboardedUsersLoading,
    error: onboardedUsersError
  } = useQuery(GET_ONBOARDED_USERS_DATA, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });


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
        <CardsComponent />
        <Grid
          display="flex"
          gap="24px"
          flexWrap="nowrap"
          flexDirection={{
            xs: "column",
            sm: "row",
          }}
        >
          <MessagesAndReactions data={data?.getCmtyEntitiesCount} refetch={refetch} loading={loading} />
          <OnboardedUsers
            data={onboardedUsersData?.getOnboardedUsersCount}
            refetch={onboardedUsersRefetch}
            loading={onboardedUsersLoading}
            error={onboardedUsersError}

          />
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
          <Submissions
            data={submissionReports?.getQuestsSubmissionsReport}
            refetch={submissionRefetch}
            loading={submissionLoading}
          />
          </Grid>
          <Heatmap data={presenceData?.getCmtyPresenceAnalytics} loading={presenceLoading} refetch={presenceRefetch} />
        </Grid>
        <QuestLeaderboard />
      </Grid>
    </>
  );
};

export default AnalyticsComponent;
