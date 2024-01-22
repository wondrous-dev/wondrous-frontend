import { PAYMENT_OPTIONS } from "components/Rewards/constants";
import { getPathArray, toCent } from "utils/common";
import { QUEST_STATUSES, TYPES, APEIRON_TYPES, FHENIX_FAUCET_ADDRESS } from "utils/constants";
import { mapAnswersToOptions, reduceConditionalRewards } from "./utils";
import { ValidationError } from "yup";
import { set } from "lodash";

const processSteps = (steps) =>
  steps.reduce((acc, next, index) => {
    const step: any = {
      id: next?._id,
      type: next.type,
      order: index + 1,
      mediaUploads: [],
      required: next.required === false ? false : true,
      prompt: next.value?.question || next?.value?.prompt || next.value || null,
    };
    const isQuiz = [TYPES.MULTI_QUIZ, TYPES.SINGLE_QUIZ].includes(next.type);
    if (isQuiz) {
      step.type = next.value.multiSelectValue;
      step.options = next.value?.answers ? mapAnswersToOptions(next.value.answers, next.value.withCorrectAnswers) : [];
      const conditionalRewards = next.value?.answers?.reduce(reduceConditionalRewards, []);
      if (conditionalRewards.length) {
        step.conditionalRewards = conditionalRewards;
      }
      step.prompt = next.value.question;
    } else if ([TYPES.LIKE_TWEET, TYPES.RETWEET, TYPES.REPLY_TWEET].includes(next.type)) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        tweetLink: next.value?.tweetLink,
      };
    } else if (next.type === TYPES.FOLLOW_TWITTER) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        tweetHandle: next.value?.tweetHandle,
      };
    } else if (next.type === TYPES.TWEET_WITH_PHRASE) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        tweetPhrase: next.value?.tweetPhrase,
      };
    } else if (next.type === TYPES.LIKE_YT_VIDEO) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        ytVideoLink: next.value?.ytVideoLink,
      };
    } else if (next.type === TYPES.SUBSCRIBE_YT_CHANNEL) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        ytChannelLink: next.value?.ytChannelLink,
      };
    } else if (next.type === TYPES.LINK_CLICK) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        linkClickUrl: next.value?.linkClickUrl,
      };
    } else if (next.type === TYPES.SNAPSHOT_PROPOSAL_VOTE) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        snapshotProposalLink: next.value?.snapshotProposalLink,
      };
    } else if (next.type === TYPES.SNAPSHOT_SPACE_VOTE) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        snapshotSpaceLink: next.value?.snapshotSpaceLink,
        snapshotVoteTimes: Number(next.value?.snapshotVoteTimes),
      };
    } else if (next.type === TYPES.DISCORD_MESSAGE_IN_CHANNEL) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        discordMessageType: next.value?.discordMessageType,
        discordChannelId: next.value?.discordChannelId,
        discordChannelIds: next.value?.discordChannelIds,
      };
    } else if (next.type === TYPES.DISCORD_EVENT_ATTENDANCE) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        discordEventId: next.value?.discordEventId,
        minDuration: next.value?.minDuration,
      };
    } else if (next.type === TYPES.VERIFY_TOKEN_HOLDING) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        tokenAddress: next.value?.verifyTokenAddress,
        tokenSymbol: next.value?.verifyTokenSymbol,
        tokenLogoUrl: next.value?.verifyTokenLogoUrl,
        tokenDecimals: next.value?.verifyTokenDecimals,
        tokenChain: next.value?.verifyTokenChain,
        tokenAmount: next.value?.verifyTokenAmount,
        tokenType: next.value?.verifyTokenType,
        tokenId: next.value?.verifyTokenId,
        tokenName: next.value?.verifyTokenName,
      };
    } else if (next.type === TYPES.DATA_COLLECTION) {
      step.prompt = next.value?.prompt;
      step.options = next?.value?.options
        ? next.value.options.map((option, idx) => ({
            position: idx,
            text: option,
          }))
        : null;
      step["additionalData"] = {
        ...next.value?.dataCollectionProps,
      };
    } else if (next.type === TYPES.LIFI_VALUE_BRIDGED) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        usdValue: toCent(next.value),
      };
    } else if (next.type === TYPES.VERIFY_MARKETSFLARE_TRIAL || Object.values(APEIRON_TYPES).includes(next.type)) {
      step.prompt = next.value;
    } else if (
      next.type === TYPES.VERIFY_FHENIX_ACTIVE_WALLET ||
      next.type === TYPES.VERIFY_FHENIX_CONTRACTS_CREATED ||
      next.type === TYPES.VERIFY_FHENIX_FAUCET_INTERACTION ||
      next.type === TYPES.VERIFY_FHENIX_WALLET_GAS_USAGE
    ) {
      step.prompt = next.value?.prompt;
      step["additionalData"] = {
        chain: "fhenix",
      };
      if (next.type === TYPES.VERIFY_FHENIX_FAUCET_INTERACTION) {
        step["additionalData"]["contractAddress"] = FHENIX_FAUCET_ADDRESS;
      }
    }
    return [...acc, step];
  }, []);

export const processSave = async ({
  isActive,
  isSaving,
  setIsSaving,
  handleMutation,
  body,
  steps,
  removedMediaSlugs,
  setSnackbarAlertOpen,
  setSnackbarAlertMessage,
  setSnackbarAlertAutoHideDuration,
}) => {
  if (!isActive && !isSaving) {
    return setIsSaving(true);
  }

  handleMutation({ body });

  const hasMediaToUpload = steps.some((step) => step.mediaUploads?.some((media) => media instanceof File));
  const hasMediaToRemove = Object.values(removedMediaSlugs).flat().length > 0;

  if (hasMediaToUpload || hasMediaToRemove) {
    setSnackbarAlertMessage("Wrapping up with your media. Please keep this window open");
    setSnackbarAlertAutoHideDuration(2000);
    setSnackbarAlertOpen(true);
  }
};

export const handleSaveError = ({ err, setErrors, setIsSaving, refs }) => {
  const errors: any = {};
  if (err instanceof ValidationError) {
    err?.inner?.forEach((error) => {
      const path = getPathArray(error.path);
      set(errors, path, error.message);
    });
    // this is a hacky way to scroll to the title

    if (errors?.title) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      if (typeof errors?.steps === "string") {
        refs?.current[0].scrollIntoView({ behavior: "smooth", block: "center" });
        setErrors(errors);
        setIsSaving(false);
        return;
      }
      const stepsFirstErrorIndex = errors?.steps?.findIndex((err) => !!err);
      if (stepsFirstErrorIndex !== -1) {
        refs?.current[stepsFirstErrorIndex + 1]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    setErrors(errors);
    setIsSaving(false);
  } else console.log(err, "Error outside of validation service");
};

const scrollToFirstError = (errors) => {};

const mapReward = (reward) => {
  if (reward?.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
    return {
      discordRewardData: {
        discordRoleId: reward?.discordRewardData?.discordRoleId,
        discordGuildId: reward?.discordRewardData?.discordGuildId,
        discordRoleName: reward?.discordRewardData?.discordRoleName,
      },
      type: reward?.type,
    };
  } else if (reward?.type === PAYMENT_OPTIONS.TOKEN || reward?.type === PAYMENT_OPTIONS.COMMUNITY_BADGE) {
    return {
      type: PAYMENT_OPTIONS.TOKEN,
      paymentMethodId: reward?.paymentMethodId,
      amount: Number(reward?.amount),
    };
  } else if (reward?.type === PAYMENT_OPTIONS.POAP) {
    const { __typename, ...rewardData } = reward?.poapRewardData;
    return {
      type: reward?.type,
      poapRewardData: rewardData,
    };
  } else if (reward?.type === PAYMENT_OPTIONS.CMTY_STORE_ITEM) {
    return {
      type: reward?.type,
      storeItemId: reward?.storeItem?.id,
    };
  }
};

const processRewards = (rewards) => {
  return rewards?.map((reward) => mapReward(reward))?.filter((reward) => reward);
};

interface IRequestBody {
  status?: string;
  questSettings: any;
  activeOrgId: string;
  steps: any[];
}

export const constructRequestBody = ({ status = null, questSettings, activeOrgId, steps }: IRequestBody) => {
  const {
    questConditions,
    requireReview,
    maxSubmission,
    isActive,
    maxApproval,
    startAt,
    endAt,
    level,
    timeBound,
    isOnboarding,
    title,
    description,
    conditionLogic,
  } = questSettings;

  const filteredQuestConditions = questConditions?.filter((condition) => condition.type && condition.conditionData);

  return {
    title,
    description,
    orgId: activeOrgId,
    isOnboarding,
    requireReview: !!requireReview,
    maxSubmission: maxSubmission ? parseInt(maxSubmission, 10) : null,
    maxApproval: maxApproval ? parseInt(maxApproval, 10) : null,
    conditionLogic,
    category: questSettings.category || null,
    questConditions: filteredQuestConditions,
    status: status || (isActive ? QUEST_STATUSES.OPEN : QUEST_STATUSES.INACTIVE),
    startAt: startAt && timeBound ? startAt.utcOffset(0).startOf("day").toISOString() : null,
    endAt: endAt && timeBound ? endAt.utcOffset(0).endOf("day").toISOString() : null,
    pointReward: questSettings.rewards[0].value,
    submissionCooldownPeriod: questSettings?.submissionCooldownPeriod,
    level: level ? parseInt(level, 10) : 1,
    rewards: processRewards(questSettings.rewards),
    steps: processSteps(steps),
  };
};
