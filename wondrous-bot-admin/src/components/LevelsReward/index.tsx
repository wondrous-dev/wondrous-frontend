import { RoundedSecondaryButton } from "components/Shared/styles";
import AddIcon from "@mui/icons-material/Add";
import { forwardRef, useContext, useState } from "react";
import { Box, ButtonBase, ClickAwayListener, Grid, Popper, Typography } from "@mui/material";
import { useDiscordRoles } from "utils/discord";
import GlobalContext from "utils/context/GlobalContext";
import { Label } from "components/CreateTemplate/styles";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { CloseIcon } from "components/Shared/DatePicker/Icons";
import { useMutation } from "@apollo/client";
import { ADD_ORG_LEVEL_REWARD, REMOVE_ORG_LEVEL_REWARD } from "graphql/mutations";
import { RewardConfigModal } from "components/LevelReward/RewardConfigModal";
import { LevelsWrapper } from "./styles";

const LevelsReward = ({ rewards, discordRoles, level, refetchLevelRewards }) => {
  // FIXME we should pass reward current level rewards probably
  // need to fetch somewhere?
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const allRoles = discordRoles.map((role) => role.roles).flat();

  const { activeOrg } = useContext(GlobalContext);

  const [removeOrgLevelReward] = useMutation(REMOVE_ORG_LEVEL_REWARD, {
    refetchQueries: ["getOrgLevelsRewards"],
  });
  const handleRemove = async (rewardId) => {
    await removeOrgLevelReward({
      variables: {
        levelRewardId: rewardId,
      },
    });
    refetchLevelRewards();
  };
  return (
    <>
      <RewardConfigModal
        isRewardModalOpen={isRewardModalOpen}
        setIsRewardModalOpen={setIsRewardModalOpen}
        level={level}
        refetchLevelRewards={refetchLevelRewards}
      />
      <Box style={{display: 'flex', gap: 5}}>
        <div style={{ display: "flex", gap: 5 }}>
          {rewards?.length &&
            rewards?.map((reward) => (
              <ExistingLevelsReward
                reward={reward}
                allRoles={allRoles}
                level={level}
                refetchLevelRewards={refetchLevelRewards}
                handleRemove={() => handleRemove(reward.id)}
              />
            ))}
        </div>
        <RoundedSecondaryButton
          onClick={(e) => setIsRewardModalOpen(true)}
          sx={{
            padding: "4px 8px !important",
            borderRadius: "6px !important",
          }}
        >
          <AddIcon
            sx={{
              color: "black",
              fontSize: "22px",
            }}
          />
        </RoundedSecondaryButton>
      </Box>
    </>
  );
};

const ExistingLevelsReward = ({ reward, allRoles, level, refetchLevelRewards, handleRemove }) => {
  const selectedRole = allRoles.find((item) => item.id === reward.discordRewardData?.discordRoleId);

  return (
    <StyledViewQuestResults>
      {reward.type === "discord_role" && (
        <>
          <img
            src="/images/discord-official-logo.png"
            height="18px"
            width="18px"
            style={{
              borderRadius: "300px",
            }}
          />
          {selectedRole?.name}
          <ButtonBase onClick={() => handleRemove()}>
            <CloseIcon />
          </ButtonBase>
        </>
      )}
      {reward.type === "token" && (
        <>
          {reward?.amount} {reward?.paymentMethod?.name}
          <ButtonBase onClick={() => handleRemove()}>
            <CloseIcon />
          </ButtonBase>
        </>
      )}
    </StyledViewQuestResults>
  );
};

export default LevelsReward;
