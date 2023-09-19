import { useLazyQuery } from "@apollo/client";
import { GET_CMTY_ENTITIES_COUNT } from "graphql/queries";
import { useContext, useEffect } from "react";
import GlobalContext from "utils/context/GlobalContext";
import MembersAnalytics from ".";
import MessagesAndReactions from "components/Analytics/AnalyticsGraphs/MessagesAndReactions";
import { MESSAGES_REACTIONS_MOCK_DATA } from "components/Analytics/MockCharts";

const DiscordAnalytics = ({ user }) => {
  const { activeOrg } = useContext(GlobalContext);
  const [getCmtyEntitiesCount, { data, refetch, loading }] = useLazyQuery(GET_CMTY_ENTITIES_COUNT, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (activeOrg?.id) {
      console.log("activeOrg?.id", activeOrg?.id), console.log("value?.id", user?.id);
      getCmtyEntitiesCount({
        variables: {
          orgId: activeOrg?.id,
          cmtyUserId: user?.id,
        },
      });
    }
  }, [activeOrg?.id, user?.id]);

  return (
    <MessagesAndReactions
      data={data?.getCmtyEntitiesCount}
      refetch={refetch}
      loading={loading}
      panelSxProps={{
        border: "none",
        bgcolor: "transparent",
        padding: 0,
      }}
    />
  );
};

export default DiscordAnalytics;
