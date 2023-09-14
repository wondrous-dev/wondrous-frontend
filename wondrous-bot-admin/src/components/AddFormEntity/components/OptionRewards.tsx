import { Box, Grid } from "@mui/material";
import { PAYMENT_OPTIONS } from "components/CreateTemplate/RewardUtils";
import DeleteIcon from "components/Icons/Delete";
import { DiscordRoleIcon, NFTIcon, PointsIcon } from "components/Icons/Rewards";
import { ButtonIconWrapper } from "components/Shared/styles";
import { TextLabel } from "components/ViewQuest/styles";
import AddIcon from "@mui/icons-material/Add";
import { useMemo } from "react";

const ICONS_MAP = {
  [PAYMENT_OPTIONS.DISCORD_ROLE]: DiscordRoleIcon,
  [PAYMENT_OPTIONS.POAP]: NFTIcon,
  [PAYMENT_OPTIONS.TOKEN]: PointsIcon,
};

const RewardContent = ({ reward }) => {
  const Icon = ICONS_MAP[reward?.type];

  const label = useMemo(() => {
    if (!reward) return null;
    if (reward?.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
      return `Role: ${reward?.discordRewardData?.discordRoleName}`;
    }
    if (reward?.type === PAYMENT_OPTIONS.TOKEN) {
      return `Token: ${reward?.amount} ${reward?.paymentMethod?.name}`;
    }
    if (reward?.type === PAYMENT_OPTIONS.POAP) {
      return `POAP: ${reward?.poapRewardData?.name}`;
    }
  }, [reward]);

  return (
    <>
      {Icon ? <Icon /> : null}

      <TextLabel fontSize="14px" fontWeight="400">
        {label}
      </TextLabel>
    </>
  );
};

const OptionRewards = ({ rewards, handleRewardDelete, handleAddReward }) => {
  
  if (!rewards?.length) return null;

  return (
    <Grid display="flex" gap="10px" flexDirection="column" paddingLeft="46px" width="100%">
      {rewards?.map((reward, idx) => {
        return (
          <Grid display="flex" gap="14px" alignItems="center" width="100%" key={idx}>
            <Box
              width="auto"
              display="flex"
              padding="6px 10px"
              height="28px"
              alignItems="center"
              bgcolor="#E8E8E8"
              borderRadius="6px"
              flex="1"
              gap="8px"
            >
              <RewardContent reward={reward} />
            </Box>
            <ButtonIconWrapper onClick={() => handleRewardDelete(idx)}>
              <DeleteIcon />
            </ButtonIconWrapper>
            <ButtonIconWrapper onClick={() => handleAddReward(idx)}>
              <AddIcon
                sx={{
                  color: "black",
                }}
              />
            </ButtonIconWrapper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default OptionRewards;
