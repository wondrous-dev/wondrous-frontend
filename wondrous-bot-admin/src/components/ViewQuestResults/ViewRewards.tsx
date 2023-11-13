import { Grid, Typography } from "@mui/material";
import { PAYMENT_OPTIONS } from "components/CreateTemplate/RewardUtils";
import { Label } from "components/CreateTemplate/styles";
import { DiscordRoleIcon, NFTIcon, PointsIcon, StoreItemRewardIcon, TokensIcon } from "components/Icons/Rewards";
import { constructRewards } from "utils/common";

const selectReward = ({ type, value }) => {
  const rewardProps = {
    points: {
      text: `${value} points`,
      Icon: PointsIcon,
    },
    "Discord Role": {
      text: `Role: ${value}`,
      Icon: DiscordRoleIcon,
    },
    POAP: {
      text: value,
      Icon: NFTIcon,
    },
    [PAYMENT_OPTIONS.COMMUNITY_BADGE]: {
      text: value,
      Icon: NFTIcon,
    },
    [PAYMENT_OPTIONS.CMTY_STORE_ITEM]: {
      text: value,
      Icon: StoreItemRewardIcon,
    }
  };
  return rewardProps[type] || { text: `${value} ${type}`, Icon: TokensIcon };
};

export const Reward = ({ type, value }) => {
  const { text, Icon = null } = selectReward({ type, value });
  return (
    <Grid
      container
      alignItems="center"
      gap="6px"
      bgcolor="#E8E8E8"
      width="fit-content"
      padding="4px"
      borderRadius="6px"
      minHeight="32px"
    >
      {Icon && <Icon />}
      <Typography lineHeight="1" color="#000" fontWeight="500" fontSize="14px" fontFamily="Poppins">
        {text}
      </Typography>
    </Grid>
  );
};

const ViewRewards = ({ rewards }) => {
  const rewardsValue = constructRewards({ rewards });

  return (
    <Grid container alignItems="center">
      <Grid container alignSelf="self-start" width="fit-content">
        <Label>Rewards</Label>
      </Grid>
      <Grid container alignItems="center" gap="14px" flex="1">
        {rewardsValue.map(Reward)}
      </Grid>
    </Grid>
  );
};

export default ViewRewards;
