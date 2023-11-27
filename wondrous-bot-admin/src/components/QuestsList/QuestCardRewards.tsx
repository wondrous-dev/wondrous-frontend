import { Box } from "@mui/material";
import { DiscordRoleIcon, NFTIcon, PointsIcon, StoreItemRewardIcon, TokensIcon } from "components/Icons/Rewards";
import { PAYMENT_OPTIONS } from "components/Rewards/constants";
import { StyledInformationTooltip } from "components/Shared/Tooltip";

const CardReward = ({ reward }) => {

  const REWARD_TEXT_ICON_MAP = {
    points: {
      text: `${reward?.pointReward} points`,
      Icon: PointsIcon,
    },
    [PAYMENT_OPTIONS.DISCORD_ROLE]: {
      //   text: `Role: ${value}`,
      text: `Role: ${reward?.discordRewardData?.discordRoleName}`,
      Icon: DiscordRoleIcon,
    },
    [PAYMENT_OPTIONS.POAP]: {
      text: `POAP: ${reward?.poapRewardData?.name}`,
      // text: value,
      Icon: NFTIcon,
    },
    [PAYMENT_OPTIONS.COMMUNITY_BADGE]: {
      text: `Badge: ${reward?.paymentMethod?.name}`,
      // text: value,
      Icon: NFTIcon,
    },
    [PAYMENT_OPTIONS.CMTY_STORE_ITEM]: {
      text: `Store Item: ${reward?.storeItem?.name}`,
      // text: value,
      Icon: StoreItemRewardIcon,
    },
    [PAYMENT_OPTIONS.TOKEN]: {
      text: `${reward?.amount} ${reward?.paymentMethod?.name}`,
      Icon: TokensIcon,
    },
  };

  const { text, Icon } = REWARD_TEXT_ICON_MAP[reward?.type] || {};

  return (
    <StyledInformationTooltip title={text}>
      <Box
        borderRadius="6px"
        padding="4px"
        border="1px solid #D9D9D9"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {Icon ? <Icon /> : null}
      </Box>
    </StyledInformationTooltip>
  );
};

const QuestCardRewards = ({ rewards, pointReward }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap="6px" flexWrap="wrap">
      <CardReward reward={{ type: "points", pointReward }} />
      {rewards?.map((reward, idx) => (
        <CardReward key={`${reward}-${reward?.id}`} reward={reward} />
      ))}
    </Box>
  );
};

export default QuestCardRewards;
