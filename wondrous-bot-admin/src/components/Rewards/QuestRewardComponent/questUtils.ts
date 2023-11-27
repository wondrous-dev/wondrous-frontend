import { verifyIsImportedToken } from "utils/common";
import { PAYMENT_OPTIONS } from "../constants";

export const handleDiscordRoleRewardRemove = ({ reward, setQuestSettings }) => {
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

export const handleStoreItemRewardRemove = ({ reward, setQuestSettings }) => {
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

export const onPaymentMethodRewardRemove = ({ reward, setQuestSettings }) => {
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

export const handleTokenRewardOnChange = ({ setQuestSettings, reward, value }) => {
  setQuestSettings((prev) => {
    return {
      ...prev,
      rewards: prev.rewards.map((compareReward) => {
        const isImportedToken = verifyIsImportedToken(compareReward?.paymentMethod?.type);
        if (
          (compareReward.type === PAYMENT_OPTIONS.TOKEN || isImportedToken) &&
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

export const handleOnRewardAdd = ({ setQuestSettings, reward }) => {
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
