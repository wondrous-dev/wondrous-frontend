import { useLazyQuery, useQuery } from "@apollo/client";
import { ArrowUpward } from "@mui/icons-material";
import { Box, ButtonBase, Grid } from "@mui/material";
import { SharedSecondaryButton } from "components/Shared/styles";
import TableComponent from "components/TableComponent";
import { StyledTableHeader, StyledTableHeaderCell } from "components/TableComponent/styles";
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
      {rewards?.map((reward, sortKey) => (
        <StyledViewQuestResults $isReward sortKey={sortKey + "reward"}>
          {reward.value} {reward.type}
        </StyledViewQuestResults>
      ))}
    </Grid>
  );
};

const QuestLeaderboard = () => {
  const [sortOrder, setSortOrder] = useState({
    sortKey: "submissions",
    order: "desc",
  });
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

  const headersConfig = [
    {
      label: "Quest Title",
    },
    {
      label: "Submissions",
      sortKey: "submissions",
    },
    {
      label: "Approvals",
      sortKey: "approvals",
    },
    {
      label: "% Completion",
      sortKey: "completion",
    },
    {
      label: "Quest Rewards",
      
    },
    {
      label: "Rewards Awarded",
      sortKey: "rewards_awarded",
    },
    {
      label: "XP Awarded",
      sortKey: "points",
    },
  ];

  const items = data?.getQuestsAnalyticsLeaderboard?.map((item, idx) => {
    return {
      id: idx,
      questName: {
        component: "label",
        width: "auto",
        textAlign: "left",
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

  const onSortOrderChange = ({ header }) => {
    console.log(header, "HEADER")
    const newSortOrder = {
      sortKey: header.sortKey,
      order: sortOrder.sortKey === header.sortKey && sortOrder.order === "desc" ? "asc" : "desc",
    }
    console.log(newSortOrder, 'new sort order')
    setSortOrder(newSortOrder);
    refetch(newSortOrder)
  };

  return (
    <>
      <TableComponent
        data={items}
        title="Quest Activity"
        headerComponent={() => {
          return (
            <StyledTableHeader>
              {headersConfig?.map((header) => (
                <StyledTableHeaderCell sortKey={header} sx={{}}>
                  <Box display="flex" alignItems="center" gap="6px">
                    {header.label}
                    {header.sortKey ? (
                      <ButtonBase type="button" onClick={() => onSortOrderChange({ header })}>
                        <ArrowUpward
                          sx={{
                            fontSize: "14px",
                            color: sortOrder.sortKey === header.sortKey ? "red" : "#949494",
                            transform:
                              sortOrder.sortKey === header.sortKey && sortOrder.order === "desc"
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                          }}
                        />
                      </ButtonBase>
                    ) : null}
                  </Box>
                </StyledTableHeaderCell>
              ))}
            </StyledTableHeader>
          );
        }}
      />
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
