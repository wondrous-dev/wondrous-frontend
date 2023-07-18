import { useLazyQuery, useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import PageHeader from "components/PageHeader";
import PageWrapper from "components/Shared/PageWrapper";
import { GET_CMTY_ENTITIES_COUNT, GET_SUBMISSION_REPORTS } from "graphql/queries";
import { useContext, useEffect } from "react";
import GlobalContext from "utils/context/GlobalContext";
import MessagesAndReactions from "./AnalyticsGraphs/MessagesAndReactions";
import Submissions from "./AnalyticsGraphs/Submissions";
import CardsComponent from "./Cards";
import { LineChart } from "./GraphsComponent";
import getMembersAndOnboardedMembers from "./utils/getMembersAndOnboardedMembers";
import getMessagesAndReactionsData from "./utils/getMessagesAndReactionsData";

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
      skip: !activeOrg?.id,
    },
  });

  const { data, refetch, loading } = useQuery(GET_CMTY_ENTITIES_COUNT, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
      skip: !activeOrg?.id,
    },
  });

  const cardsStats = {
    cmtyMembers: 1201,
    allTimeCmtyMembers: 1888,
    questCompletions: 100,
    allTimeQuestCompletions: 202,
    rewards: 50,
    allTimeRewards: 70,
  };

  const membersAndOnboardedMembers = getMembersAndOnboardedMembers();
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
        <CardsComponent stats={cardsStats} />
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
          <LineChart title="New Members" data={membersAndOnboardedMembers} />
        </Grid>
        <Submissions
          data={submissionReports?.getQuestsSubmissionsReport}
          refetch={submissionRefetch}
          loading={submissionLoading}
        />
      </Grid>
    </>
  );
};

export default AnalyticsComponent;
