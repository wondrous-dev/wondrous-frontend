import { DATA_COLLECTION_TYPES, TYPES } from "./constants";

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
  additionalData: {
    tweetLink?: string;
    tweetHandle?: string;
    tweetPhrase?: string;
    snapshotProposalLink?: string;
    snapshotSpaceLink?: string;
    snapshotVoteTimes?: number;
    discordChannelId?: string;
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
  };
};

type OutputQuestStep = {
  id: number;
  _id: string;
  type: string;
  required?: boolean;
  mediaUploads?: Array<{
    slug: string;
    name: string;
    type: string;
  }>;
  value:
    | string
    | {
        question: string;
        withCorrectAnswers: boolean;
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
        tweetHandle: string;
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
        discordChannelName: string;
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
      };
};

export function transformQuestConfig(obj: InputQuestStep[]): OutputQuestStep[] {
  if (!obj) return [];
  return obj.map((step) => {
    const outputStep: OutputQuestStep = {
      id: step.order,
      _id: step.id,
      type: step.type,
      required: step.required === false ? false : true,
      value: "",
      mediaUploads: step?.media || [],
    };

    if (step.type === TYPES.TEXT_FIELD || step.type === TYPES.NUMBER || step.type === TYPES.ATTACHMENTS) {
      outputStep.value = step.prompt;
    } else if ([TYPES.SINGLE_QUIZ, TYPES.MULTI_QUIZ].includes(step.type)) {
      const hasCorrectAnswer = step.options?.some((option) => option.correct !== null && option.correct !== undefined);
      outputStep.value = {
        question: step.prompt,
        withCorrectAnswers: hasCorrectAnswer,
        multiSelectValue: step.type,
        answers: step.options?.map((option) => ({
          value: option.text,
          ...(hasCorrectAnswer ? { isCorrect: option.correct } : {}),
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
        discordChannelName: step?.additionalData?.discordChannelName,
        discordMessageType: step?.additionalData?.discordMessageType,
      };
    } else if (step.type === TYPES.JOIN_DISCORD_COMMUNITY_CALL) {
      outputStep.value = {
        prompt: step?.prompt,
        discordChannelName: step?.additionalData?.discordChannelName,
      };
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
