import { RoundedSecondaryButton } from "components/Shared/styles";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useEffect, useMemo } from "react";
import { Box, ButtonBase } from "@mui/material";
import GlobalContext from "utils/context/GlobalContext";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { CloseIcon } from "components/Shared/DatePicker/Shared/Icons";
import { useMutation } from "@apollo/client";
import { ADD_ORG_LEVEL_REWARD, REMOVE_ORG_LEVEL_REWARD } from "graphql/mutations";
import RewardModal from "components/Rewards/RewardModal";
import { DiscordRoleIcon, NFTIcon, PoapIcon, StoreItemRewardIcon, TokensIcon } from "components/Icons/Rewards";
import { useAddRewardModalState } from "components/Rewards/utils";
import { PAYMENT_OPTIONS } from "components/Rewards/constants";
import { useTour } from "@reactour/tour";
import { useLevelsRewardTutorial } from "components/TutorialComponent/Tutorials/LevelsTutorial";

interface AddOrgLevelRewardInput {
  orgId: string;
  level: number;
  type: string;
  discordRewardData?: any;
  paymentMethodId?: string;
  paymentMethod?: any;
  amount?: number;
  poapRewardData?: any;
  storeItem?: any;
}

const LevelsReward = ({ rewards, discordRoles, level, refetchLevelRewards }) => {
  // FIXME we should pass reward current level rewards probably
  // need to fetch somewhere?

  const rewardModalState = useAddRewardModalState();

  const { isOpen, setCurrentStep, steps } = useTour();
  const { activeOrg } = useContext(GlobalContext);
  const { setIsRewardModalOpen, resetStates } = rewardModalState;

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

  useLevelsRewardTutorial(rewardModalState?.rewardType, setIsRewardModalOpen);

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
      input.amount = parseInt(reward?.amount);
      input.type = PAYMENT_OPTIONS.TOKEN;
    }
    if (reward?.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
      input.discordRewardData = reward?.discordRewardData;
    }
    if (reward?.type === PAYMENT_OPTIONS.POAP) {
      input.poapRewardData = reward?.poapRewardData;
    }
    if (reward?.type === PAYMENT_OPTIONS.CMTY_STORE_ITEM) {
      input.storeItem = reward?.storeItem;
    }
    addOrgLevelReward({
      variables: {
        input,
      },
    }).then(() => {
      refetchLevelRewards();
    });
  };

  const handleTourStepOnClose = () => {
    if (!isOpen) return;
    const hasRewards = rewards?.length > 0;
    const stepId = hasRewards ? "levels-modal-close-with-rewards" : "levels-modal-close";
    const nextStepIdx = steps.findIndex((step: any) => step.id === stepId);
    setCurrentStep(nextStepIdx);
  };
  const handleModalClose = () => {
    resetStates();
    handleTourStepOnClose();
  };
  if (level === "1") return null;

  const handleOpen = () => {
    setIsRewardModalOpen(true);
    if (!isOpen) return;
    const modalOpenStepIdx = steps.findIndex((step: any) => step.id === "levels-modal-open");
    setCurrentStep(modalOpenStepIdx);
  };

  return (
    <>
      <RewardModal
        title={`Add Reward for Level ${level}`}
        handleRewardModalToggle={handleModalClose}
        handleOnRewardAdd={onRewardAdd}
        maxModalWidth={800}
        rewardModalState={rewardModalState}
        options={[
          PAYMENT_OPTIONS.TOKEN,
          PAYMENT_OPTIONS.COMMUNITY_BADGE,
          PAYMENT_OPTIONS.DISCORD_ROLE,
          PAYMENT_OPTIONS.POAP,
        ]}
      />
      <Box style={{ display: "flex", gap: 5 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {rewards?.length &&
            rewards?.map((reward) => (
              <ExistingLevelsReward
                reward={reward}
                discordRoles={discordRoles}
                containerProps = {{
                  'data-tour': `levels-modal-close-rewards-${reward.id}`
                }}
                handleRemove={() => handleRemove(reward.id)}
              />
            ))}
        </div>
        <RoundedSecondaryButton
          onClick={handleOpen}
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

export const ExistingLevelsReward = ({ reward, discordRoles, handleRemove = null, containerProps = {} }) => {
  const allRoles = useMemo(() => discordRoles.map((role) => role.roles).flat(), [discordRoles]);

  const selectedRole = allRoles?.find((item) => item.id === reward.discordRewardData?.discordRoleId);

  return (
    <StyledViewQuestResults {...containerProps}>
      {reward.type === PAYMENT_OPTIONS.DISCORD_ROLE && (
        <>
          <DiscordRoleIcon height={25} />
          {selectedRole?.name}
          {handleRemove ? (
            <ButtonBase onClick={() => handleRemove()}>
              <CloseIcon />
            </ButtonBase>
          ) : null}
        </>
      )}
      {reward.type === PAYMENT_OPTIONS.TOKEN && (
        <>
          {reward?.paymentMethod?.type === PAYMENT_OPTIONS.COMMUNITY_BADGE ? <NFTIcon height={25} /> : <TokensIcon />}
          {reward?.amount} {reward?.paymentMethod?.name}
          {handleRemove ? (
            <ButtonBase onClick={() => handleRemove()}>
              <CloseIcon />
            </ButtonBase>
          ) : null}
        </>
      )}
      {reward?.type === PAYMENT_OPTIONS.POAP && (
        <>
          <PoapIcon height={25} />
          {reward?.poapRewardData?.name}
          {handleRemove ? (
            <ButtonBase onClick={() => handleRemove()}>
              <CloseIcon />
            </ButtonBase>
          ) : null}
        </>
      )}
      {reward?.type === PAYMENT_OPTIONS.CMTY_STORE_ITEM && (
        <>
          <StoreItemRewardIcon height={25} />
          {reward?.storeItem?.name}
          {handleRemove ? (
            <ButtonBase onClick={() => handleRemove()}>
              <CloseIcon />
            </ButtonBase>
          ) : null}
        </>
      )}
    </StyledViewQuestResults>
  );
};

export default LevelsReward;
