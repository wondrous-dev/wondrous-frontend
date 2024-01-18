export * from "./questValidator";
export * from "./storeValidator";
export * from "./customValidation";
export * from "./referralValidator";

import { ERRORS, STORE_ITEM_TYPES, TYPES } from "utils/constants";
import * as Yup from "yup";
import { getYouTubeVideoId, validateChannelUrl } from "services/validators/customValidation";
export const ValidationError = Yup.ValidationError;

const twitterHandleRegex = /^[A-Za-z0-9_]{1,15}$/;

const ALL_TYPES = [
  TYPES.TEXT_FIELD,
  TYPES.MULTI_QUIZ,
  TYPES.NUMBER,
  TYPES.ATTACHMENTS,
  TYPES.SINGLE_QUIZ,
  TYPES.LIKE_TWEET,
  TYPES.FOLLOW_TWITTER,
  TYPES.REPLY_TWEET,
  TYPES.RETWEET,
  TYPES.TWEET_WITH_PHRASE,
  TYPES.SNAPSHOT_PROPOSAL_VOTE,
  TYPES.SNAPSHOT_SPACE_VOTE,
  TYPES.DISCORD_MESSAGE_IN_CHANNEL,
  TYPES.DISCORD_EVENT_ATTENDANCE,
  TYPES.DATA_COLLECTION,
  TYPES.LIKE_YT_VIDEO,
  TYPES.SUBSCRIBE_YT_CHANNEL,
  TYPES.LINK_CLICK,
  TYPES.LIFI_VALUE_BRIDGED,
  TYPES.MIGRATE_ORIGIN_USERS,
  TYPES.VERIFY_MARKETSFLARE_TRIAL,
  TYPES.VERIFY_APEIRON_ACCOUNT_BY_WALLET_ADDRESS,
  TYPES.VERIFY_APEIRON_APOSTLES_IV_OVER_80,
  TYPES.VERIFY_APEIRON_DEFEAT_FIRST_BOSS,
  TYPES.VERIFY_APEIRON_10_MINS_PLAYED,
  TYPES.VERIFY_GITCOIN_PASSPORT_SCORE,
  TYPES.CONNECT_WALLET,
];

export const STORE_TYPES = [
  STORE_ITEM_TYPES.EXTERNAL_SHOP,
  STORE_ITEM_TYPES.DISCORD_ROLE,
  STORE_ITEM_TYPES.NFT,
  STORE_ITEM_TYPES.TOKEN,
];

const sharedValidation = {
  type: Yup.string().required("Type is required").oneOf(ALL_TYPES, "Type is not valid"),
  order: Yup.number().required("Order is required"),
  prompt: Yup.string().required("Prompt is required"),
};

const twitterSnapshotSharedValidation = {
  type: Yup.string().required("Type is required").oneOf(ALL_TYPES, "Type is not valid"),
  order: Yup.number().required("Order is required"),
};

const stepTypes = {
  [TYPES.TEXT_FIELD]: Yup.object().shape({
    ...sharedValidation,
  }),
  [TYPES.MULTI_QUIZ]: Yup.object().shape({
    ...sharedValidation,
    options: Yup.array()
      .of(
        Yup.object().shape({
          position: Yup.number().required("Position is required"),
          text: Yup.string().required("Answer is required"),
          correct: Yup.boolean().optional().nullable(),
        })
      )
      .min(1, ERRORS.MIN_OPTION_LENGTH)
      .required("Options are required"),
  }),
  [TYPES.SINGLE_QUIZ]: Yup.object().shape({
    ...sharedValidation,
    options: Yup.array()
      .of(
        Yup.object().shape({
          position: Yup.number().required("Position is required"),
          text: Yup.string().required("Answer is required"),
          correct: Yup.boolean().optional(),
        })
      )
      .min(1, ERRORS.MIN_OPTION_LENGTH)
      .required("Options are required"),
  }),

  [TYPES.LIKE_TWEET]: Yup.object().shape({
    ...twitterSnapshotSharedValidation,
    additionalData: Yup.object().shape({
      tweetLink: Yup.string().required("Tweet link is required").url("Tweet link is not valid"),
    }),
  }),
  [TYPES.RETWEET]: Yup.object().shape({
    ...twitterSnapshotSharedValidation,
    additionalData: Yup.object().shape({
      tweetLink: Yup.string().required("Tweet link is required").url("Tweet link is not valid"),
    }),
  }),
  [TYPES.REPLY_TWEET]: Yup.object().shape({
    ...twitterSnapshotSharedValidation,
    additionalData: Yup.object().shape({
      tweetLink: Yup.string().required("Tweet link is required").url("Tweet link is not valid"),
    }),
  }),
  [TYPES.FOLLOW_TWITTER]: Yup.object().shape({
    ...twitterSnapshotSharedValidation,
    additionalData: Yup.object().shape({
      tweetHandle: Yup.string()
        .matches(twitterHandleRegex, "Invalid Twitter handle")
        .required("Tweet handle is required")
        .test(
          "is-not-url",
          "Tweet handle must not be a URL",
          (value) => !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/.test(value)
        ),
    }),
  }),
  [TYPES.TWEET_WITH_PHRASE]: Yup.object().shape({
    ...twitterSnapshotSharedValidation,
    additionalData: Yup.object().shape({
      tweetPhrase: Yup.string().required("Tweet phrase is required"),
    }),
  }),
  [TYPES.SNAPSHOT_PROPOSAL_VOTE]: Yup.object().shape({
    ...twitterSnapshotSharedValidation,
    additionalData: Yup.object().shape({
      snapshotProposalLink: Yup.string()
        .required("Snapshot proposal link is required")
        .url("Snapshot proposal link is not valid"),
    }),
  }),
  [TYPES.SNAPSHOT_SPACE_VOTE]: Yup.object().shape({
    ...twitterSnapshotSharedValidation,
    additionalData: Yup.object().shape({
      snapshotSpaceLink: Yup.string()
        .required("Snapshot space link is required")
        .url("Snapshot space link is not valid"),
      snapshotVoteTimes: Yup.number()
        .required("Snapshot vote times is required")
        .typeError("Amount must be a number")
        .min(0, "Value is too small"),
    }),
  }),
  [TYPES.DISCORD_MESSAGE_IN_CHANNEL]: Yup.object().shape({
    ...twitterSnapshotSharedValidation,
    additionalData: Yup.object().shape({
      discordChannelIds: Yup.array().of(Yup.string()).required("At least one Discord channel is required"),
    }),
  }),
  [TYPES.NUMBER]: Yup.object().shape({
    ...sharedValidation,
  }),
  [TYPES.ATTACHMENTS]: Yup.object().shape({
    ...sharedValidation,
  }),
  [TYPES.DATA_COLLECTION]: Yup.object().shape({
    ...sharedValidation,
    additionalData: Yup.object().shape({
      dataCollectionType: Yup.string().required("You need to select data collection type"),
    }),
    options: Yup.array()
      .of(
        Yup.object().shape({
          position: Yup.number().required("Position is required"),
          text: Yup.string().required("Option is required"),
        })
      )
      .min(1, ERRORS.MIN_OPTION_LENGTH)
      .max(25, ERRORS.MAX_OPTION_LENGTH)
      .required("Options are required")
      .nullable(),
  }),
  [TYPES.CONNECT_WALLET]: Yup.object().shape({
    ...sharedValidation,
  }),
  [TYPES.VERIFY_TOKEN_HOLDING]: Yup.object().shape({
    additionalData: Yup.object().shape({
      tokenAddress: Yup.string().required("Token address is required"),
      tokenType: Yup.string().required("Token type is required"),
      tokenAmount: Yup.number().required("Token amount is required"),
      tokenName: Yup.string().required("Token name is required"),
      tokenChain: Yup.string().required("Token chain is required"),
    }),
  }),
  [TYPES.LIKE_YT_VIDEO]: Yup.object().shape({
    ...twitterSnapshotSharedValidation,
    additionalData: Yup.object().shape({
      // check it is a youtube url
      ytVideoLink: Yup.string()
        .required("Youtube video link is required")
        .url("Must be a url")
        .test("ytVideoLink", "Must be a youtube url", function (value) {
          const videoId = getYouTubeVideoId(value);
          if (!videoId) {
            return false;
          }
          return true;
        }),
    }),
  }),
  [TYPES.LINK_CLICK]: Yup.object().shape({
    ...twitterSnapshotSharedValidation,
    additionalData: Yup.object().shape({
      linkClickUrl: Yup.string().required("Link is required").url("Must be a url"),
    }),
  }),
  [TYPES.LIFI_VALUE_BRIDGED]: Yup.object().shape({
    additionalData: Yup.object().shape({
      usdValue: Yup.number().required("USD value is required"),
    }),
  }),
  [TYPES.MIGRATE_ORIGIN_USERS]: Yup.object().shape({
    ...sharedValidation,
  }),
  [TYPES.VERIFY_MARKETSFLARE_TRIAL]: Yup.object().shape({
    ...sharedValidation,
  }),
  [TYPES.VERIFY_GITCOIN_PASSPORT_SCORE]: Yup.object().shape({
    ...sharedValidation,
    additionalData: Yup.object().shape({
      minimumScoreThreshold: Yup.number().required("Score is required"),
    }),
  }),
  [TYPES.VERIFY_APEIRON_10_MINS_PLAYED]: Yup.object().shape({
    ...sharedValidation,
  }),
  [TYPES.VERIFY_APEIRON_ACCOUNT_BY_WALLET_ADDRESS]: Yup.object().shape({
    ...sharedValidation,
  }),
  [TYPES.VERIFY_APEIRON_APOSTLES_IV_OVER_80]: Yup.object().shape({
    ...sharedValidation,
  }),
  [TYPES.VERIFY_APEIRON_DEFEAT_FIRST_BOSS]: Yup.object().shape({
    ...sharedValidation,
  }),
  [TYPES.SUBSCRIBE_YT_CHANNEL]: Yup.object().shape({
    additionalData: Yup.object().shape({
      ytChannelLink: Yup.string()
        .required("Youtube channel link is required")
        .url("Must be a url")
        .test("ytChannelLink", "Must be a youtube channel url", function (value) {
          const valid = validateChannelUrl(value);
          if (valid) {
            return true;
          }
          return false;
        }),
    }),
  }),
  [TYPES.DISCORD_EVENT_ATTENDANCE]: Yup.object().shape({
    additionalData: Yup.object().shape({
      discordEventId: Yup.string().required("Discord event is required"),
      minDuration: Yup.number()
        .required("Min duration is required")
        .typeError("Amount must be a number")
        .min(0, "Value is too small"),
    }),
  }),
};

const STORE_FIELDS = Yup.object().shape({
  type: Yup.string().required("Type is required").oneOf(STORE_TYPES, "Type is not valid"),
  name: Yup.string().required("Name is required"),
  description: Yup.string().nullable(),
  ptPrice: Yup.number().nullable(),
  price: Yup.number().nullable(),
  deliveryMethod: Yup.string().nullable(),
  maxPurchase: Yup.number().nullable(),
});

const storeItemTypes = {
  [STORE_ITEM_TYPES.EXTERNAL_SHOP]: STORE_FIELDS.shape({
    url: Yup.string().url("This is not a valid url").required("URL is required"),
  }),
  [STORE_ITEM_TYPES.DISCORD_ROLE]: STORE_FIELDS.shape({
    additionalData: Yup.object().shape({
      discordRoleId: Yup.string().required("Please select a discord role"),
      discordRoleName: Yup.string().required("Please select a discord role"),
      discordGuildId: Yup.string().required("Please select a discord role"),
    }),
  }),
  [STORE_ITEM_TYPES.NFT]: STORE_FIELDS.shape({
    nftMetadataId: Yup.string().required("Please select an NFT"),
  }),
  [STORE_ITEM_TYPES.TOKEN]: STORE_FIELDS.shape({
    cmtyPaymentMethodId: Yup.string().required("Please select an Token"),
    quantity: Yup.number().required("Amount is required"),
  }),
};

export const QUEST_FIELDS = {
  title: Yup.string().required("Title is required"),
  steps: Yup.array()
    .of(Yup.lazy((value) => (stepTypes[value.type] ? stepTypes[value.type] : Yup.object().shape({}))))
    .required("Steps is required.")
    .min(1, "Please add at least one quest step"),
};

export const questValidator = async (body) =>
  Yup.object().shape(QUEST_FIELDS).validate(body, {
    abortEarly: false,
  });

export const storeItemValidator = async (body) => {
  const schema = storeItemTypes[body.type];
  if (!schema) {
    throw new Error(`Validation schema not found for type: ${body.type}`);
  }
  return schema.validate(body, {
    abortEarly: false,
  });
};
