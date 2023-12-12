import { TYPES } from "utils/constants";

export const COMPONENT_OPTIONS = [
  {
    label: "Text",
    value: TYPES.TEXT_FIELD,
  },
  {
    label: "Multiple Choice",
    value: TYPES.MULTI_QUIZ,
  },
  {
    label: "Number",
    value: TYPES.NUMBER,
  },
  {
    label: "Attachments",
    value: TYPES.ATTACHMENTS,
  },
  {
    label: "Like A Tweet",
    value: TYPES.LIKE_TWEET,
  },
  {
    label: "Follow A Twitter Account",
    value: TYPES.FOLLOW_TWITTER,
  },
  {
    label: "Reply To A Tweet",
    value: TYPES.REPLY_TWEET,
  },
  {
    label: "Retweet A Tweet",
    value: TYPES.RETWEET,
  },
  {
    label: "Tweet With A Mention Or Hashtag",
    value: TYPES.TWEET_WITH_PHRASE,
  },
  {
    label: "Vote On Snapshot Proposal",
    value: TYPES.SNAPSHOT_PROPOSAL_VOTE,
  },
  {
    label: "Vote On Snapshot Space",
    value: TYPES.SNAPSHOT_SPACE_VOTE,
  },
  {
    label: "Send A Message in Discord Channel",
    value: TYPES.DISCORD_MESSAGE_IN_CHANNEL,
  },
  {
    label: "Verify Discord event attendance",
    value: TYPES.DISCORD_EVENT_ATTENDANCE,
  },
  {
    label: "Data Collection",
    value: TYPES.DATA_COLLECTION,
  },
  {
    label: "Verify Token Holding",
    value: TYPES.VERIFY_TOKEN_HOLDING,
  },
  {
    label: "Verify YouTube Subscription",
    value: TYPES.SUBSCRIBE_YT_CHANNEL,
  },
  {
    label: "Verify YouTube Like",
    value: TYPES.LIKE_YT_VIDEO,
  },
  {
    label: "Click on link",
    value: TYPES.LINK_CLICK,
  },
];

export const MULTICHOICE_DEFAULT_VALUE = {
  question: "",
  withCorrectAnswers: false,
  withConditionalRewards: false,
  multiSelectValue: TYPES.MULTI_QUIZ,
  answers: [
    {
      value: "",
      isCorrect: true,
    },
  ],
};
