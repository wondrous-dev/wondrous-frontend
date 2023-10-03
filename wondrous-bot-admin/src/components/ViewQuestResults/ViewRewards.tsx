import { Grid, Typography } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import { DiscordRoleIcon, NFTIcon, PointsIcon, TokensIcon } from "components/Icons/Rewards";
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
  };
  return rewardProps[type] || { text: `${value} ${type}`, Icon: TokensIcon };
};

const Reward = ({ type, value }) => {
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
