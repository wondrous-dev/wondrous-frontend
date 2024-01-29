import { APEIRON_TYPES, DATA_COLLECTION_TYPES, TYPES } from "./constants";

type InputQuestStep = {
  type: string;
  id: string;
  order: number;
  prompt: string;
  media?: Array<{
    slug: string;
    name: string;
    type: string;
  }> | null;
  required?: boolean;
  options: Array<{
    position: number;
    text: string;
    correct: boolean;
    __typename: string;
  }> | null;
  __typename: string;
  conditionalRewards: any;
  additionalData: {
    tweetLink?: string;
    tweetHandle?: string;
    tweetPhrase?: string;
    snapshotProposalLink?: string;
    snapshotSpaceLink?: string;
    snapshotVoteTimes?: number;
    discordChannelId?: string;
    discordChannelIds?: string[];
    discordChannelName?: string;
    discordMessageType?: string;
    dataCollectionType?: string;
    tokenAddress?: string;
    tokenSymbol?: string;
    tokenLogoUrl?: string;
    tokenDecimals?: string;
    tokenChain?: string;
    tokenAmount?: string;
    tokenType?: string;
    tokenId?: string;
    tokenName?: string;
    ytVideoLink?: string;
    ytChannelLink?: string;
    linkClickUrl?: string;
    discordEventId?: string;
    minDuration?: number;
    usdValue?: number;
    gitcoinPassportMinimumScoreThreshold?: number;
  };
};

type OutputQuestStep = {
  order: number;
  _id?: string;
  type: string;
  required?: boolean;
  mediaUploads?: Array<{
    slug: string;
    name: string;
    type: string;
  }>;
  value:
    | string
    | number
    | {
        question: string;
        withCorrectAnswers: boolean;
        withConditionalRewards?: boolean;
        multiSelectValue: string;
        answers: Array<{
          value: string;
          isCorrect?: boolean;
        }>;
      }
    | {
        prompt?: string;
        tweetLink: string;
      }
    | {
        prompt?: string;
        ytVideoLink: string;
      }
    | {
        prompt?: string;
        ytChannelLink: string;
      }
    | {
        prompt?: string;
        tweetHandle: string;
      }
    | {
        prompt?: string;
        linkClickUrl: string;
      }
    | {
        prompt?: string;
        tweetPhrase: string;
      }
    | {
        prompt?: string;
        snapshotProposalLink?: string;
        snapshotSpaceLink?: string;
        snapshotVoteTimes?: number;
      }
    | {
        prompt?: string;
        discordChannelId?: string;
        discordChannelIds?: string[];
        discordMessageType?: string;
      }
    | {
        prompt?: string;
        verifyTokenChain?: string;
        verifyTokenAddress?: string;
        verifyTokenAmount?: string;
        verifyTokenType?: string;
        verifyTokenDecimals?: string;
        verifyTokenSymbol?: string;
        verifyTokenLogoUrl?: string;
        verifyTokenId?: string;
        verifyTokenName?: string;
      }
    | {
        prompt?: string;
        options?: string[];
        dataCollectionProps: {
          dataCollectionType?: string;
        };
      }
    | {
        prompt?: string;
        discordEventId?: string;
        minDuration?: number;
      }
    | {
        prompt?: string;
        gitcoinPassportMinimumScoreThreshold?: number;
      };
};

export function transformQuestConfig(obj: InputQuestStep[]): OutputQuestStep[] {
  if (!obj) return [];
  return obj.map((step) => {
    const outputStep: OutputQuestStep = {
      order: step.order,
      _id: step.id,
      type: step.type,
      required: step.required === false ? false : true,
      value: "",
      mediaUploads: step?.media || [],
    };
    if (
      step.type === TYPES.TEXT_FIELD ||
      step.type === TYPES.NUMBER ||
      step.type === TYPES.ATTACHMENTS ||
      step.type === TYPES.CONNECT_WALLET
    ) {
      outputStep.value = step.prompt;
    } else if ([TYPES.SINGLE_QUIZ, TYPES.MULTI_QUIZ].includes(step.type)) {
      const hasCorrectAnswer = step.options?.some((option) => option.correct !== null && option.correct !== undefined);
      const hasStepConditionalRewards = step.conditionalRewards?.length > 0;
      const defaultRewardsIfConditionalRewardsIsOn = hasStepConditionalRewards ? [{ type: null }] : [];
      outputStep.value = {
        question: step.prompt,
        withConditionalRewards: hasStepConditionalRewards,
        withCorrectAnswers: hasCorrectAnswer,
        multiSelectValue: step.type,
        answers: step.options?.map((option) => ({
          value: option.text,
          rewards:
            step?.conditionalRewards?.find((item) => item.optionText === option.text)?.rewardData ||
            defaultRewardsIfConditionalRewardsIsOn,
          ...(hasCorrectAnswer
            ? {
                isCorrect: option.correct,
              }
            : {}),
        })),
      };
    } else if ([TYPES.LIKE_TWEET, TYPES.RETWEET, TYPES.REPLY_TWEET].includes(step.type)) {
      outputStep.value = {
        prompt: step?.prompt,
        tweetLink: step?.additionalData?.tweetLink,
      };
    } else if (step.type === TYPES.FOLLOW_TWITTER) {
      outputStep.value = {
        prompt: step?.prompt,
        tweetHandle: step?.additionalData?.tweetHandle,
      };
    } else if (step.type === TYPES.TWEET_WITH_PHRASE) {
      outputStep.value = {
        prompt: step?.prompt,
        tweetPhrase: step?.additionalData?.tweetPhrase,
      };
    } else if (step.type === TYPES.LIKE_YT_VIDEO) {
      outputStep.value = {
        prompt: step?.prompt,
        ytVideoLink: step?.additionalData?.ytVideoLink,
      };
    } else if (step.type === TYPES.LINK_CLICK) {
      outputStep.value = {
        prompt: step?.prompt,
        linkClickUrl: step?.additionalData?.linkClickUrl,
      };
    } else if (step.type === TYPES.SUBSCRIBE_YT_CHANNEL) {
      outputStep.value = {
        prompt: step?.prompt,
        ytChannelLink: step?.additionalData?.ytChannelLink,
      };
    } else if (step.type === TYPES.SNAPSHOT_PROPOSAL_VOTE) {
      outputStep.value = {
        prompt: step?.prompt,
        snapshotProposalLink: step?.additionalData?.snapshotProposalLink,
      };
    } else if (step.type === TYPES.SNAPSHOT_SPACE_VOTE) {
      outputStep.value = {
        prompt: step?.prompt,
        snapshotSpaceLink: step?.additionalData?.snapshotSpaceLink,
        snapshotVoteTimes: Number(step?.additionalData?.snapshotVoteTimes),
      };
    } else if (step.type === TYPES.VERIFY_TOKEN_HOLDING) {
      outputStep.value = {
        prompt: step?.prompt,
        verifyTokenChain: step?.additionalData?.tokenChain,
        verifyTokenAddress: step?.additionalData?.tokenAddress,
        verifyTokenAmount: step?.additionalData?.tokenAmount,
        verifyTokenType: step?.additionalData?.tokenType,
        verifyTokenDecimals: step?.additionalData?.tokenDecimals,
        verifyTokenLogoUrl: step?.additionalData?.tokenLogoUrl,
        verifyTokenSymbol: step?.additionalData?.tokenSymbol,
        verifyTokenId: step?.additionalData?.tokenId,
        verifyTokenName: step?.additionalData?.tokenName,
      };
    } else if (step.type === TYPES.DISCORD_MESSAGE_IN_CHANNEL) {
      outputStep.value = {
        prompt: step?.prompt,
        discordChannelId: step?.additionalData?.discordChannelId,
        discordChannelIds: step?.additionalData?.discordChannelIds,
        discordMessageType: step?.additionalData?.discordMessageType,
      };
    } else if (step.type === TYPES.DISCORD_EVENT_ATTENDANCE) {
      outputStep.value = {
        prompt: step?.prompt,
        discordEventId: step?.additionalData?.discordEventId,
        minDuration: step?.additionalData?.minDuration,
      };
    } else if (step.type === TYPES.LIFI_VALUE_BRIDGED) {
      outputStep.value = Number(step?.additionalData?.usdValue) / 100;
    } else if (
      step.type === TYPES.MIGRATE_ORIGIN_USERS ||
      step.type === TYPES.VERIFY_MARKETSFLARE_TRIAL ||
      Object.values(APEIRON_TYPES).includes(step.type)
    ) {
      outputStep.value = step?.prompt;
    } else if (step.type === TYPES.REFERRAL) {
      outputStep.value = step?.prompt;
    } else if (step.type === TYPES.VERIFY_GITCOIN_PASSPORT_SCORE) {
      console.log("step", step);
      outputStep.value = {
        prompt: step?.prompt,
        gitcoinPassportMinimumScoreThreshold: step?.additionalData?.gitcoinPassportMinimumScoreThreshold,
      };
    } else if (
      step.type === TYPES.VERIFY_FHENIX_ACTIVE_WALLET ||
      step.type === TYPES.VERIFY_FHENIX_CONTRACTS_CREATED ||
      step.type === TYPES.VERIFY_FHENIX_FAUCET_INTERACTION ||
      step.type === TYPES.VERIFY_FHENIX_WALLET_GAS_USAGE
    ) {
      outputStep.value = step?.prompt;
    } else if (step.type === TYPES.DATA_COLLECTION) {
      const dataCollectionType = step?.additionalData?.dataCollectionType;
      outputStep.value = {
        prompt: step?.prompt,
        ...(dataCollectionType !== DATA_COLLECTION_TYPES.LOCATION
          ? {
              options: [...step?.options]?.sort((a, b) => a.position - b.position).map((option) => option.text),
            }
          : {}),
        dataCollectionProps: {
          dataCollectionType: step?.additionalData?.dataCollectionType,
        },
      };
    }

    return outputStep;
  });
}
