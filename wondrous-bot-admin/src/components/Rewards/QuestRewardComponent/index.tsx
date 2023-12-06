import { Divider, Grid } from "@mui/material";
import { RewardWrapper, RewardWrapperWithTextField, RewardsComponent } from "components/Rewards/RewardUtils";
import { DiscordRoleIcon, PointsIcon, StoreItemRewardIcon, TokensIcon } from "components/Icons/Rewards";
import { SharedSecondaryButton } from "components/Shared/styles";
import RewardModal from "../RewardModal";
import { PoapImage } from "components/CreateTemplate/styles";
import { verifyIsImportedToken } from "utils/common";
import {
  handleDiscordRoleRewardRemove,
  handleTokenRewardOnChange,
  onPaymentMethodRewardRemove,
  handleStoreItemRewardRemove,
  handleOnRewardAdd,
} from "./questUtils";
import { useAddRewardModalState } from "components/Rewards/utils";
import { PAYMENT_OPTIONS } from "../constants";
import { useTour } from "@reactour/tour";
import { useEffect } from "react";

const QuestRewardComponent = ({
  rewards,
  setQuestSettings,
  hasReferralStep,
}: {
  rewards: { [key: string]: any }[];
  setQuestSettings: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  hasReferralStep: boolean;
}) => {
  const rewardModalState = useAddRewardModalState();
  const { setIsRewardModalOpen,resetStates } = rewardModalState;

  const { isOpen: isTourOpen, setCurrentStep, setSteps, steps } = useTour();

  useEffect(() => {
    if (isTourOpen) {
      const newSteps = steps.map((step: any) => {
        if (step.id === "tutorial-quest-rewards") {
          return {
            ...step,
            handleNextAction: () => {
              setIsRewardModalOpen(true);
              setCurrentStep((prev) => prev + 1);
            },
          };
        }
        if (step.id === "tutorial-add-rewards") {
          return {
            ...step,
            handleNextAction: () => {
              setIsRewardModalOpen(false);
              setCurrentStep((prev) => prev + 1);
            },
            handlePrevAction: () => {
              setIsRewardModalOpen(false);
              setCurrentStep((prev) => prev - 1);
            },
          };
        }
        if (step.id === "tutorial-activate-quest") {
          return {
            ...step,
            handlePrevAction: () => {
              setIsRewardModalOpen(true);
              setCurrentStep((prev) => prev - 1);
            },
          };
        }
        return step;
      });
      setSteps(newSteps);
    }
  }, [isTourOpen]);

  const handleToggleModal = () => {
    resetStates()
    if (isTourOpen) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleOnChangePoints = (key, value) => {
    setQuestSettings((prev) => {
      return {
        ...prev,
        rewards: prev.rewards.map((reward) => {
          const defaultValue = value ? Number(value) : null;
          return {
            ...reward,
            value: reward.type === key ? defaultValue : reward.value,
          };
        }),
      };
    });
  };

  const onPoapRewardRemove = (reward) => {
    return rewards?.filter((r) => {
      if (r.type === PAYMENT_OPTIONS.POAP) {
        return r.id !== reward.id;
      }
      return true;
    });
  };

  const rewardComponents = {
    [PAYMENT_OPTIONS.DISCORD_ROLE]: {
      Component: ({ reward }) => (
        <RewardWrapper Icon={DiscordRoleIcon} text={reward.discordRewardData.discordRoleName} />
      ),
      handleOnRemove: (reward) => handleDiscordRoleRewardRemove({ reward, setQuestSettings }),
    },
    [PAYMENT_OPTIONS.TOKEN]: {
      Component: ({ reward }) => (
        <RewardWrapperWithTextField
          reward={reward}
          handleOnChange={(e) => handleTokenRewardOnChange({ setQuestSettings, reward, value: e.target.value })}
          handleOnClear={() => handleTokenRewardOnChange({ setQuestSettings, reward, value: null })}
          text={String(reward?.paymentMethod.name)}
          placeholder={`How much ${String(reward?.paymentMethod.name)}?`}
          Icon={
            reward?.paymentMethod?.nftMetadata?.mediaUrl
              ? () => <PoapImage src={reward?.paymentMethod?.nftMetadata?.mediaUrl} />
              : TokensIcon
          }
        />
      ),
      handleOnRemove: (reward) => onPaymentMethodRewardRemove({ reward, setQuestSettings }),
    },
    [PAYMENT_OPTIONS.POAP]: {
      Component: ({ reward }) => (
        <RewardWrapper
          Icon={() => <PoapImage src={reward?.poapRewardData?.imageUrl} />}
          text={reward?.poapRewardData?.name}
        />
      ),
      handleOnRemove: onPoapRewardRemove,
    },
    [PAYMENT_OPTIONS.COMMUNITY_BADGE]: {
      Component: ({ reward }) => {
        const isImportedToken = verifyIsImportedToken(reward?.paymentMethod?.type);
        if (isImportedToken) {
          return (
            <RewardWrapperWithTextField
              reward={reward}
              handleOnChange={(e) => handleTokenRewardOnChange({ setQuestSettings, reward, value: e.target.value })}
              handleOnClear={() => handleTokenRewardOnChange({ setQuestSettings, reward, value: null })}
              text={String(reward?.paymentMethod.name)}
              placeholder={`How much ${String(reward?.paymentMethod.name)}?`}
              Icon={() => <PoapImage src={reward?.paymentMethod?.nftMetadata?.mediaUrl} />}
            />
          );
        }
        return (
          <RewardWrapper
            Icon={() => <PoapImage src={reward?.paymentMethod?.nftMetadata?.mediaUrl} />}
            text={reward?.paymentMethod?.name}
          />
        );
      },
      handleOnRemove: (reward) => onPaymentMethodRewardRemove({ reward, setQuestSettings }),
    },
    [PAYMENT_OPTIONS.CMTY_STORE_ITEM]: {
      Component: ({ reward }) => {
        return <RewardWrapper Icon={StoreItemRewardIcon} text={reward?.storeItem?.name} />;
      },
      handleOnRemove: (reward) => handleStoreItemRewardRemove({ reward, setQuestSettings }),
    },
  };
  const pointReward = rewards.filter((reward) => reward?.type === "points")[0];
  const otherRewards = rewards.filter((reward) => reward?.type !== "points");

  const handleOpenRewardModal = () => {
    if(isTourOpen) {
      setCurrentStep((prev) => prev + 1);
    }
    setIsRewardModalOpen(true)
  }

  return (
    <>
      <RewardModal
        rewardModalState={rewardModalState}
        handleRewardModalToggle={handleToggleModal}
        handleOnRewardAdd={(reward) => handleOnRewardAdd({ reward, setQuestSettings })}
        rewards={rewards}
      />

      <Grid container flexWrap="nowrap" maxWidth="inherit">
        <Grid container item gap="14px" alignItems="center" justifyContent="center" flex="1">
          <RewardWrapperWithTextField
            reward={pointReward}
            handleOnChange={(e) => {
              handleOnChangePoints(pointReward?.type, e.target.value);
            }}
            text="Points"
            placeholder="How many points awarded?"
            Icon={PointsIcon}
            handleOnClear={() => {
              handleOnChangePoints(pointReward.type, null);
            }}
          />
          <Divider
            sx={{
              background: "#E8E8E8",
              width: "100%",
            }}
          />
          <RewardsComponent rewards={otherRewards} rewardComponents={rewardComponents} />
          <SharedSecondaryButton onClick={handleOpenRewardModal}>
            {hasReferralStep ? "Add reward per referral" : "Add New Reward"}
          </SharedSecondaryButton>
        </Grid>
      </Grid>
    </>
  );
};

export default QuestRewardComponent;
