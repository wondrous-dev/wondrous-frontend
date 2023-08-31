import { Grid, Typography } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import { constructRewards } from "utils/common";
import PointsIcon from "components/Icons/PointsIcon.svg";
import DiscordIcon from "components/Icons/DiscordIcon.svg";
import NFTIcon from "components/Icons/NFTIcon.svg";

const selectReward = ({ type, value }) => {
  const rewardProps = {
    points: {
      text: `${value} points`,
      icon: PointsIcon,
    },
    "Discord Role": {
      text: `Role: ${value}`,
      icon: DiscordIcon,
    },
    POAP: {
      text: value,
      icon: NFTIcon,
    },
  };
  return rewardProps[type] || { text: `${value} ${type}` };
};

const Reward = ({ type, value }) => {
  const { text, icon } = selectReward({ type, value });
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
      <img src={icon} />
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
