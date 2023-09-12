import { PAYMENT_OPTIONS } from "./RewardUtils";

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
    ...(withCorrectAnswers ? { correct: answer.isCorrect } : {}),
  }));
};

export const mapAnswerToConditionalRewards = (answer: any) => {
  if (!answer.rewards?.length) return [];

  return answer.rewards
    .map((reward) => {
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
          return {
            type: reward?.type,
            paymentMethodId: reward?.paymentMethodId,
            amount: Number(reward?.amount),
          };
        case PAYMENT_OPTIONS.POAP:
          const { __typename, ...rewardData } = reward?.poapRewardData || {};
          return {
            type: reward?.type,
            poapRewardData: rewardData,
          };
        default:
          return null;
      }
    })
    .filter((reward) => reward);
};

export const reduceConditionalRewards = (acc: any[], answer: any) => {
  const rewards = mapAnswerToConditionalRewards(answer);
  if (rewards.length) {
    acc.push({ optionText: answer.value, rewardData: rewards });
  }
  return acc;
};
