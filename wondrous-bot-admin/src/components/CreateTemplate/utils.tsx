import { PAYMENT_OPTIONS } from "components/Rewards/constants";

export const DEFAULT_QUEST_SETTINGS_STATE_VALUE = {
  level: "1",
  timeBound: false,
  maxSubmission: null,
  maxApproval: null,
  requireReview: false,
  isActive: false,
  isOnboarding: false,
  startAt: null,
  endAt: null,
  questConditions: [],
  title: "",
  conditionLogic: "and",
  category: null,
  description: "",
  submissionCooldownPeriod: null,
  rewards: [
    {
      value: 0,
      type: "points",
    },
  ],
};

export const mapAnswersToOptions = (answers: any[], withCorrectAnswers: boolean) => {
  return answers.map((answer, idx) => ({
    position: idx,
    text: answer.value?.trim(),
    ...(withCorrectAnswers ? { correct: answer.isCorrect || false } : {}),
  }));
};

export const mapAnswerToConditionalRewards = (answer: any) => {
  if (!answer.rewards?.length) return [];

  return answer.rewards
    ?.map((reward) => {
      switch (reward?.type) {
        case PAYMENT_OPTIONS.DISCORD_ROLE:
          return {
            discordRewardData: {
              discordRoleId: reward?.discordRewardData?.discordRoleId,
              discordGuildId: reward?.discordRewardData?.discordGuildId,
              discordRoleName: reward?.discordRewardData?.discordRoleName,
            },
            type: reward?.type,
          };
        case PAYMENT_OPTIONS.TOKEN:
        case PAYMENT_OPTIONS.COMMUNITY_BADGE:
          return {
            type: PAYMENT_OPTIONS.TOKEN,
            paymentMethodId: reward?.paymentMethodId,
            amount: reward?.paymentMethod === PAYMENT_OPTIONS.COMMUNITY_BADGE ? 1 : reward?.amount,
          };
        case PAYMENT_OPTIONS.POAP:
          const { __typename, ...rewardData } = reward?.poapRewardData || {};
          return {
            type: reward?.type,
            poapRewardData: rewardData,
          };
        case PAYMENT_OPTIONS.CMTY_STORE_ITEM:
          return {
            type: reward?.type,
            storeItemId: reward?.storeItem?.id,
          };
        default:
          return null;
      }
    })
    ?.filter((reward) => reward);
};

export const reduceConditionalRewards = (acc: any[], answer: any) => {
  const rewards = mapAnswerToConditionalRewards(answer);
  if (rewards.length) {
    acc.push({ optionText: answer.value?.trim(), rewardData: rewards });
  }
  return acc;
};
