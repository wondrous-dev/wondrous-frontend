import { Grid } from "@mui/material";
import TableComponent from "components/TableComponent";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { constructRewards } from "utils/common";

const RewardComponent = ({ value }) => {
  const rewards = constructRewards({ rewards: value });
  console.log(rewards, "REWARDS");
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

const QuestLeaderboard = ({ data }) => {
  console.log(data, "DATA");
  const headers = [
    "Quest Title",
    "Submissions",
    "Approvals",
    "% Completion",
    "Quest Rewards",
    "Rewards Awarded",
    "XP Awarded",
  ];

  const items = data?.map((item, idx) => {
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
            width: '25%'
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

  return <TableComponent headers={headers} data={items} />;
};

export default QuestLeaderboard;
