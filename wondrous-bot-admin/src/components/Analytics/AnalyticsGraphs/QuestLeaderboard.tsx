import { useLazyQuery, useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import { SharedSecondaryButton } from "components/Shared/styles";
import TableComponent from "components/TableComponent";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { GET_QUEST_LEADERBOARD } from "graphql/queries";
import { useContext, useEffect, useState } from "react";
import { constructRewards } from "utils/common";
import { LIMIT } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";

const RewardComponent = ({ value }) => {
  const rewards = constructRewards({ rewards: value });
  return (
    <Grid display="flex" gap="6px" flexWrap="wrap">
      {rewards?.map((reward, key) => (
        <StyledViewQuestResults $isReward key={key + "reward"}>
          {reward.value} {reward.type}
        </StyledViewQuestResults>
      ))}
    </Grid>
  );
};

const QuestLeaderboard = () => {
  const { activeOrg } = useContext(GlobalContext);
  const [hasMore, setHasMore] = useState(true);
  const [getQuestLeaderboard, { data, refetch, loading, fetchMore }] = useLazyQuery(GET_QUEST_LEADERBOARD, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const handleFetchMore = async () => {
    const res = await fetchMore({
      variables: {
        offset: data?.getQuestsAnalyticsLeaderboard?.length,
      },
    });
    setHasMore(res?.data?.getQuestsAnalyticsLeaderboard?.length >= LIMIT);
  };

  useEffect(() => {
    if (activeOrg?.id) {
      getQuestLeaderboard({
        variables: {
          orgId: activeOrg?.id,
          limit: LIMIT,
          offset: 0,
        },
      }).then(({ data }) => setHasMore(data?.getQuestsAnalyticsLeaderboard?.length >= LIMIT));
    }
  }, [activeOrg?.id]);

  const headers = [
    "Quest Title",
    "Submissions",
    "Approvals",
    "% Completion",
    "Quest Rewards",
    "Rewards Awarded",
    "XP Awarded",
  ];

  const items = data?.getQuestsAnalyticsLeaderboard?.map((item, idx) => {
    return {
      id: idx,
      questName: {
        component: "label",
        value: item.title,
        componentProps: {
          fontWeight: 500,
        },
      },
      submissions: {
        component: "label",
        value: item.totalNumOfSubmissions || 0,
        componentProps: {
          fontWeight: 500,
        },
      },
      approvals: {
        component: "label",
        value: item.approvedSubsNum || 0,
        componentProps: {
          fontWeight: 500,
        },
      },
      completion: {
        component: "label",
        value: `${item.completion || 0}%`,
        componentProps: {
          fontWeight: 500,
        },
      },
      questRewards: {
        component: "custom",
        tableStyle: {
          width: "25%",
        },
        value: item.rewards,
        customComponent: RewardComponent,
      },
      rewardsAwarded: {
        component: "label",
        value: `x${item.totalNumOfRewards || 0}`,
        componentProps: {
          fontWeight: 500,
        },
      },
      xpAwarded: {
        component: "label",
        value: item.totalPointReward || 0,
        componentProps: {
          fontWeight: 500,
        },
      },
    };
  });

  return (
    <>
      <TableComponent headers={headers} data={items} />
      {hasMore && data?.getQuestsAnalyticsLeaderboard?.length >= LIMIT ? (
        <SharedSecondaryButton
          style={{
            width: "fit-content",
            alignSelf: "center",
          }}
          onClick={handleFetchMore}
        >
          Show more
        </SharedSecondaryButton>
      ) : null}
    </>
  );
};

export default QuestLeaderboard;
