import { Divider, Grid } from "@mui/material";
import {
  PAYMENT_OPTIONS,
  RewardWrapper,
  RewardWrapperWithTextField,
  RewardsComponent,
} from "components/CreateTemplate/RewardUtils";
import { DiscordRoleIcon, PointsIcon, StoreItemRewardIcon, TokensIcon } from "components/Icons/Rewards";
import { SharedSecondaryButton } from "components/Shared/styles";
import RewardModal, { useAddRewardModalState } from "./RewardModal";
import { PoapImage } from "./styles";

const handleDiscordRoleRewardRemove = ({ reward, setQuestSettings }) => {
  setQuestSettings((prev) => {
    const newRewards = prev.rewards.filter((r) => {
      if (r.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
        return r.discordRewardData.discordRoleId !== reward.discordRewardData.discordRoleId;
      }
      return true;
    });
    return {
      ...prev,
      rewards: newRewards,
    };
  });
};

const handleStoreItemRewardRemove = ({ reward, setQuestSettings }) => {
  setQuestSettings((prev) => {
    const newRewards = prev.rewards.filter((r) => {
      if (r.type === PAYMENT_OPTIONS.CMTY_STORE_ITEM) {
        return r?.storeItem?.id !== reward?.storeItem?.id;
      }
      return true;
    });
    return {
      ...prev,
      rewards: newRewards,
    };
  });
};

const OnPaymentMethodRewardRemove = ({ reward, setQuestSettings }) => {
  setQuestSettings((prev) => {
    const newRewards = prev.rewards.filter((r) => {
      if (r.type === PAYMENT_OPTIONS.TOKEN || r.type === PAYMENT_OPTIONS.COMMUNITY_BADGE) {
        return r.paymentMethodId !== reward.paymentMethodId;
      }
      return true;
    });
    return {
      ...prev,
      rewards: newRewards,
    };
  });
};

const handleTokenRewardOnChange = ({ setQuestSettings, reward, value }) => {
  setQuestSettings((prev) => {
    return {
      ...prev,
      rewards: prev.rewards.map((compareReward) => {
        if (
          compareReward.type === PAYMENT_OPTIONS.TOKEN &&
          compareReward.paymentMethod?.id === reward?.paymentMethod?.id
        ) {
          return {
            ...reward,
            amount: value ? Number(value) : null,
          };
        }
        return compareReward;
      }),
    };
  });
};

const RewardComponent = ({
  rewards,
  setQuestSettings,
  hasReferralStep,
}: {
  rewards: { [key: string]: any }[];
  setQuestSettings: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  hasReferralStep: boolean;
}) => {
  const onRewardAdd = (reward) => {
    setQuestSettings((prev) => {
      const filteredRewards = prev.rewards.filter((i) => {
        if (i.type === PAYMENT_OPTIONS.TOKEN) {
          return i.paymentMethodId !== reward.paymentMethod?.id;
        }
        return true;
      });
      return {
        ...prev,
        rewards: [...filteredRewards, reward],
      };
    });
  };

  const rewardModalState = useAddRewardModalState();
  const { setIsRewardModalOpen, isTourOpen, setCurrentStep } = rewardModalState;

  const handleToggleModal = () => {
    setIsRewardModalOpen((prev) => !prev);
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
          Icon={TokensIcon}
        />
      ),
      handleOnRemove: (reward) => OnPaymentMethodRewardRemove({ reward, setQuestSettings }),
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
        return (
          <RewardWrapper
            Icon={() => <PoapImage src={reward?.paymentMethod?.nftMetadata?.mediaUrl} />}
            text={reward?.paymentMethod?.name}
          />
        );
      },
      handleOnRemove: (reward) => OnPaymentMethodRewardRemove({ reward, setQuestSettings }),
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
  return (
    <>
      <RewardModal
        rewardModalState={rewardModalState}
        handleRewardModalToggle={handleToggleModal}
        handleOnRewardAdd={onRewardAdd}
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
            placeholder="How many points?"
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
          <SharedSecondaryButton onClick={() => setIsRewardModalOpen(true)}>
            {hasReferralStep ? "Add reward per referral" : "Add New Reward"}
          </SharedSecondaryButton>
        </Grid>
      </Grid>
    </>
  );
};

export { RewardComponent };
