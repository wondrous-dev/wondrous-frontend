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
      title="Member Engagement"
      panelSxProps={{
        border: "none",
        borderRadius: '6px',
        bgcolor: "#F7F7F7",
        padding: '14px',
      }}
    />
  );
};

export default DiscordAnalytics;
