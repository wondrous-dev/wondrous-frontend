import { RoundedSecondaryButton } from "components/Shared/styles";
import AddIcon from "@mui/icons-material/Add";
import { useContext } from "react";
import { Box, ButtonBase } from "@mui/material";
import GlobalContext from "utils/context/GlobalContext";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { CloseIcon } from "components/Shared/DatePicker/Icons";
import { useMutation } from "@apollo/client";
import { ADD_ORG_LEVEL_REWARD, REMOVE_ORG_LEVEL_REWARD } from "graphql/mutations";
import RewardModal, { useAddRewardModalState } from "components/CreateTemplate/RewardModal";
import { PAYMENT_OPTIONS } from "components/CreateTemplate/RewardUtils";
import { NFTIcon, PoapIcon, TokensIcon } from "components/Icons/Rewards";

interface AddOrgLevelRewardInput {
  orgId: string;
  level: number;
  type: string;
  discordRewardData?: any;
  paymentMethodId?: string;
  paymentMethod?: any;
  amount?: number;
  poapRewardData?: any;
}

const LevelsReward = ({ rewards, discordRoles, level, refetchLevelRewards }) => {
  // FIXME we should pass reward current level rewards probably
  // need to fetch somewhere?
  const allRoles = discordRoles.map((role) => role.roles).flat();

  const rewardModalState = useAddRewardModalState();

  const { activeOrg } = useContext(GlobalContext);
  const { setIsRewardModalOpen } = rewardModalState;

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

  const [addOrgLevelReward] = useMutation(ADD_ORG_LEVEL_REWARD, {
    refetchQueries: ["getOrgLevelsRewards"],
  });

  const onRewardAdd = async (reward) => {
    const isCommunityBadge = reward?.type === PAYMENT_OPTIONS.COMMUNITY_BADGE;
    let input: AddOrgLevelRewardInput = {
      orgId: activeOrg?.id,
      level: level,
      type: reward?.type,
    };
    if (reward?.type === PAYMENT_OPTIONS.TOKEN || isCommunityBadge) {
      input.paymentMethodId = reward?.paymentMethodId;
      input.amount = isCommunityBadge ? null : parseInt(reward?.amount);
      input.type = PAYMENT_OPTIONS.TOKEN;
    }
    if (reward?.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
      input.discordRewardData = reward?.discordRewardData;
    }
    if (reward?.type === PAYMENT_OPTIONS.POAP) {
      input.poapRewardData = reward?.poapRewardData;
    }
    addOrgLevelReward({
      variables: {
        input,
      },
    }).then(() => {
      refetchLevelRewards();
    });
  };

  return (
    <>
      <RewardModal
        handleRewardModalToggle={() => setIsRewardModalOpen(false)}
        handleOnRewardAdd={onRewardAdd}
        rewardModalState={rewardModalState}
      />
      <Box style={{ display: "flex", gap: 5 }}>
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
      {reward.type === PAYMENT_OPTIONS.DISCORD_ROLE && (
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
      {reward.type === PAYMENT_OPTIONS.TOKEN && (
        <>
          {reward?.paymentMethod?.type === PAYMENT_OPTIONS.COMMUNITY_BADGE ? <NFTIcon /> : <TokensIcon />}
          {reward?.amount} {reward?.paymentMethod?.name}
          <ButtonBase onClick={() => handleRemove()}>
            <CloseIcon />
          </ButtonBase>
        </>
      )}
      {reward?.type === PAYMENT_OPTIONS.POAP && (
        <>
        {reward?.poapRewardData?.name} <PoapIcon />
          <ButtonBase onClick={() => handleRemove()}>
            <CloseIcon />
          </ButtonBase>
        </>
      )}
    </StyledViewQuestResults>
  );
};

export default LevelsReward;
