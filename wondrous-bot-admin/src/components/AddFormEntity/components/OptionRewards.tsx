import AddIcon from "@mui/icons-material/Add";
import { Box, Grid } from "@mui/material";
import { PoapImage } from "components/CreateTemplate/styles";
import DeleteIcon from "components/Icons/Delete";
import { DiscordRoleIcon, NFTIcon, PoapIcon, StoreItemRewardIcon, TokensIcon } from "components/Icons/Rewards";
import { PAYMENT_OPTIONS } from "components/Rewards/constants";
import { ButtonIconWrapper } from "components/Shared/styles";
import { TextLabel } from "components/ViewQuest/styles";

const ICONS_MAP = {
  [PAYMENT_OPTIONS.DISCORD_ROLE]: DiscordRoleIcon,
  [PAYMENT_OPTIONS.POAP]: PoapIcon,
  [PAYMENT_OPTIONS.TOKEN]: TokensIcon,
  [PAYMENT_OPTIONS.COMMUNITY_BADGE]: NFTIcon,
  [PAYMENT_OPTIONS.CMTY_STORE_ITEM]: StoreItemRewardIcon,
};

const RewardContent = ({ reward }) => {
  const Icon = reward?.paymentMethod?.nftMetadata?.mediaUrl
    ? () => <PoapImage src={reward?.paymentMethod?.nftMetadata?.mediaUrl} />
    : ICONS_MAP[reward?.type];

  const label = {
    [PAYMENT_OPTIONS.DISCORD_ROLE]: `Role: ${reward?.discordRewardData?.discordRoleName}`,
    [PAYMENT_OPTIONS.TOKEN]: `Token: ${reward?.amount} ${reward?.paymentMethod?.name}`,
    [PAYMENT_OPTIONS.POAP]: `POAP: ${reward?.poapRewardData?.name}`,
    [PAYMENT_OPTIONS.COMMUNITY_BADGE]: `NFT: ${reward?.amount} ${reward?.paymentMethod?.name}`,
    [PAYMENT_OPTIONS.CMTY_STORE_ITEM]: `Store Item: ${reward?.storeItem?.name}`,
  };

  return (
    <>
      {Icon ? <Icon /> : null}

      <TextLabel fontSize="14px" fontWeight="400">
        {
          label[
            reward?.paymentMethod?.type === PAYMENT_OPTIONS.COMMUNITY_BADGE
              ? PAYMENT_OPTIONS.COMMUNITY_BADGE
              : reward?.type
          ]
        }
      </TextLabel>
    </>
  );
};

const OptionRewards = ({ rewards, handleRewardDelete, handleAddReward, id }) => {
  if (!rewards?.length) return null;

  const addEmptyReward = (reward) => {
    if (reward && reward.type !== null) return null;
    handleAddReward(id);
  };

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
              onClick={() => addEmptyReward(reward)}
              color="#000"
              sx={{
                cursor: "pointer",
              }}
            >
              {reward?.type === null ? "Select a reward" : <RewardContent reward={reward} />}
            </Box>
            {rewards?.length > 1 ? (
              <ButtonIconWrapper onClick={() => handleRewardDelete(idx)}>
                <DeleteIcon />
              </ButtonIconWrapper>
            ) : null}
            <ButtonIconWrapper onClick={() => handleAddReward(id)}>
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
