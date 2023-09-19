import { useLazyQuery } from "@apollo/client";
import { Box, CircularProgress } from "@mui/material";
import { GET_USER_QUEST_SUBMISSION_ANALYTICS } from "graphql/queries";
import { useContext, useEffect } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { CommonTypography, DataTitle } from "./styles";

const StatsComponent = ({ user }) => {
  const { activeOrg } = useContext(GlobalContext);
  const [getUserQuestSubmissionAnalytics, { data, loading, refetch }] = useLazyQuery(
    GET_USER_QUEST_SUBMISSION_ANALYTICS,
    {
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    }
  );
  const { approvalsCount, completionRate, totalNumOfRewards, totalPointReward, totalSubmissions } =
    data?.getUserQuestSubmissionAnalytics || {};
  useEffect(() => {
    if (user?.id) {
      getUserQuestSubmissionAnalytics({
        variables: {
          cmtyUserId: user?.id,
          orgId: activeOrg?.id,
        },
      });
    }
  }, [user?.id, activeOrg?.id]);
  const ITEMS = [
    {
      label: "Total submissions",
      value: totalSubmissions,
    },
    {
      label: "% Completeion",
      value: `${completionRate}%`,
    },
    {
      label: "Approved submissions",
      value: approvalsCount,
    },
    {
      label: "XP earned",
      value: totalPointReward,
    },
    {
      label: "Rewards earned",
      value: `x${totalNumOfRewards}`,
    },
  ];
  return (
    <Box display="flex" flexDirection="column" gap="8px">
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress
            size={60}
            thickness={5}
            sx={{
              color: "#2A8D5C",
              animationDuration: "10000ms",
            }}
          />
        </Box>
      ) : (
        ITEMS.map((item, idx) => {
          return (
            <Box display="flex" alignItems="center" gap="24px" padding="10px">
              <DataTitle>{item.label}</DataTitle>
              <CommonTypography>{item.value || 0}</CommonTypography>
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default StatsComponent;
