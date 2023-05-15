import { TYPES } from "utils/constants";
import * as Yup from "yup";

export const ValidationError = Yup.ValidationError;

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
  TYPES.JOIN_DISCORD_COMMUNITY_CALL,
];

const sharedValidation = {
  type: Yup.string().required("Type is required").oneOf(ALL_TYPES, "Type is not valid"),
  order: Yup.number().required("Order is required"),
  prompt: Yup.string().required("Prompt is required"),
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
          correct: Yup.boolean().optional(),
        })
      )
      .required("Options are required"),
  }),
  [TYPES.LIKE_TWEET]: Yup.object().shape({
    ...sharedValidation,
    additionalData: Yup.object().shape({
      tweetLink: Yup.string().required("Tweet link is required").url("Tweet link is not valid"),
    }),
  }),
  [TYPES.RETWEET]: Yup.object().shape({
    ...sharedValidation,
    additionalData: Yup.object().shape({
      tweetLink: Yup.string().required("Tweet link is required").url("Tweet link is not valid"),
    }),
  }),
  [TYPES.REPLY_TWEET]: Yup.object().shape({
    ...sharedValidation,
    additionalData: Yup.object().shape({
      tweetLink: Yup.string().required("Tweet link is required").url("Tweet link is not valid"),
    }),
  }),
  [TYPES.FOLLOW_TWITTER]: Yup.object().shape({
    ...sharedValidation,
    additionalData: Yup.object().shape({
      tweetHandle: Yup.string().required("Tweet handle is required"),
    }),
  }),
  [TYPES.TWEET_WITH_PHRASE]: Yup.object().shape({
    ...sharedValidation,
    additionalData: Yup.object().shape({
      tweetPhrase: Yup.string().required("Tweet phrase is required"),
    }),
  }),
  [TYPES.SNAPSHOT_PROPOSAL_VOTE]: Yup.object().shape({
    ...sharedValidation,
    additionalData: Yup.object().shape({
      snapshotProposalLink: Yup.string().required("Snapshot proposal link is required").url("Snapshot proposal link is not valid"),
    }),
  }),
  [TYPES.SNAPSHOT_SPACE_VOTE]: Yup.object().shape({
    ...sharedValidation,
    additionalData: Yup.object().shape({
      snapshotSpaceLink: Yup.string().required("Snapshot space link is required").url("Snapshot space link is not valid"),
      snapshotVoteTimes: Yup.number().required("Snapshot vote times is required"),
    }),
  }),
  [TYPES.DISCORD_MESSAGE_IN_CHANNEL]: Yup.object().shape({
    ...sharedValidation,
    additionalData: Yup.object().shape({
      discordMessageType: Yup.string().required("Discord message type is required"),
      discordChannelName: Yup.string().required("Discord channel id is required"),
    }),
  }),
  [TYPES.NUMBER]: Yup.object().shape({
    ...sharedValidation,
  }),
  [TYPES.ATTACHMENTS]: Yup.object().shape({
    ...sharedValidation,
  }),
};

export const QUEST_FIELDS = {
  title: Yup.string().required("Title is required"),
  steps: Yup.array()
    .of(Yup.lazy((value) => (stepTypes[value.type] ? stepTypes[value.type] : Yup.object().shape({}))))
    .required("Steps is required.")
    .min(1, "Steps must have at least one element."),
};

export const questValidator = async (body) => Yup.object().shape(QUEST_FIELDS).validate(body, {
  abortEarly: false,
});
