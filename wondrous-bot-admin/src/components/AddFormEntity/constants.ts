import { TYPES } from "utils/constants";
import TextSvg from "../Icons/ComponentOptions/Text.svg";
import MultipleChoiceSvg from "../Icons/ComponentOptions/MultipleChoice.svg";
import NumberSvg from "../Icons/ComponentOptions/Number.svg";
import AttachmentsSvg from "../Icons/ComponentOptions/Attachments.svg";
import ClickOnLinkSvg from "../Icons/ComponentOptions/ClickOnLink.svg";
import DataCollectionSvg from "../Icons/ComponentOptions/DataCollection.svg";
import LikeATweetSvg from "../Icons/ComponentOptions/LikeATweet.svg";
import FollowATwitterAccount from "../Icons/ComponentOptions/FollowATwitterAccount.svg";
import ReplyToATweet from "../Icons/ComponentOptions/ReplyToATweet.svg";
import RetweetATweet from "../Icons/ComponentOptions/RetweetATweet.svg";
import TweetWithAMention from "../Icons/ComponentOptions/TweetWithAMention.svg";
import SendAMessageInDiscord from "../Icons/ComponentOptions/SendAMessageInDiscord.svg";
import VerifyDiscordEventAttendance from "../Icons/ComponentOptions/VerifyDiscordEventAttendance.svg";
import VerifyYouTubeSubs from "../Icons/ComponentOptions/VerifyYouTubeSubs.svg";
import VerifyYouTubeLike from "../Icons/ComponentOptions/VerifyYouTubeLike.svg";
import VerifyGitcoinPassportScore from "../Icons/ComponentOptions/VerifyGitcoinPassportScore.svg";
import VoteOnSnapshotProposal from "../Icons/ComponentOptions/VoteOnSnapshotProposal.svg";
import VoteOnSnapshotSpace from "../Icons/ComponentOptions/VoteOnSnapshotSpace.svg";
import VerifyWalletConnection from "../Icons/ComponentOptions/VerifyWalletConnection.svg";
import VerifyTokenHolding from "../Icons/ComponentOptions/VerifyTokenHolding.svg";
import AddCustomOnChainAction from "../Icons/ComponentOptions/AddCustomOnChainAction.svg";

export const COMPONENT_CATEGORIES = {
  ACTION: "action",
  TWITTER: "twitter",
  DISCORD: "discord",
  YOUTUBE: "youtube",
  CRYPTO: "crypto",
  CUSTOM: "custom steps",
};

export const COMPONENT_OPTIONS: {
  label: string;
  value: string;
  icon: string;
  category: (typeof COMPONENT_CATEGORIES)[keyof typeof COMPONENT_CATEGORIES];
}[] = [
  {
    label: "Text",
    value: TYPES.TEXT_FIELD,
    icon: TextSvg,
    category: COMPONENT_CATEGORIES.ACTION,
  },
  {
    label: "Multiple Choice",
    value: TYPES.MULTI_QUIZ,
    category: COMPONENT_CATEGORIES.ACTION,
    icon: MultipleChoiceSvg,
  },
  {
    label: "Number",
    value: TYPES.NUMBER,
    category: COMPONENT_CATEGORIES.ACTION,
    icon: NumberSvg,
  },
  {
    label: "Attachments",
    value: TYPES.ATTACHMENTS,
    category: COMPONENT_CATEGORIES.ACTION,
    icon: AttachmentsSvg,
  },
  {
    label: "Click on link",
    value: TYPES.LINK_CLICK,
    category: COMPONENT_CATEGORIES.ACTION,
    icon: ClickOnLinkSvg,
  },
  {
    label: "Data Collection",
    value: TYPES.DATA_COLLECTION,
    category: COMPONENT_CATEGORIES.ACTION,
    icon: DataCollectionSvg,
  },
  {
    label: "Like A Tweet",
    value: TYPES.LIKE_TWEET,
    category: COMPONENT_CATEGORIES.TWITTER,
    icon: LikeATweetSvg,
  },
  {
    label: "Follow A Twitter Account",
    value: TYPES.FOLLOW_TWITTER,
    category: COMPONENT_CATEGORIES.TWITTER,
    icon: FollowATwitterAccount,
  },
  {
    label: "Reply To A Tweet",
    value: TYPES.REPLY_TWEET,
    category: COMPONENT_CATEGORIES.TWITTER,
    icon: ReplyToATweet,
  },
  {
    label: "Retweet A Tweet",
    value: TYPES.RETWEET,
    category: COMPONENT_CATEGORIES.TWITTER,
    icon: RetweetATweet,
  },
  {
    label: "Tweet With A Mention Or Hashtag",
    value: TYPES.TWEET_WITH_PHRASE,
    category: COMPONENT_CATEGORIES.TWITTER,
    icon: TweetWithAMention,
  },
  {
    label: "Verify Gitcoin Passport Score",
    value: TYPES.VERIFY_GITCOIN_PASSPORT_SCORE,
    category: COMPONENT_CATEGORIES.CRYPTO,
    icon: VerifyGitcoinPassportScore,
  },
  {
    label: "Vote On Snapshot Proposal",
    value: TYPES.SNAPSHOT_PROPOSAL_VOTE,
    category: COMPONENT_CATEGORIES.CRYPTO,
    icon: VoteOnSnapshotProposal,
  },
  {
    label: "Vote On Snapshot Space",
    value: TYPES.SNAPSHOT_SPACE_VOTE,
    category: COMPONENT_CATEGORIES.CRYPTO,
    icon: VoteOnSnapshotSpace,
  },
  {
    label: "Send A Message in Discord Channel",
    value: TYPES.DISCORD_MESSAGE_IN_CHANNEL,
    category: COMPONENT_CATEGORIES.DISCORD,
    icon: SendAMessageInDiscord,
  },
  {
    label: "Verify Discord event attendance",
    value: TYPES.DISCORD_EVENT_ATTENDANCE,
    category: COMPONENT_CATEGORIES.DISCORD,
    icon: VerifyDiscordEventAttendance,
  },
  {
    label: "Verify Wallet Connection",
    value: TYPES.CONNECT_WALLET,
    category: COMPONENT_CATEGORIES.CRYPTO,
    icon: VerifyWalletConnection,
  },
  {
    label: "Verify Token Holding",
    value: TYPES.VERIFY_TOKEN_HOLDING,
    category: COMPONENT_CATEGORIES.CRYPTO,
    icon: VerifyTokenHolding,
  },
  {
    label: "Verify YouTube Subscription",
    value: TYPES.SUBSCRIBE_YT_CHANNEL,
    category: COMPONENT_CATEGORIES.YOUTUBE,
    icon: VerifyYouTubeSubs,
  },
  {
    label: "Verify YouTube Like",
    value: TYPES.LIKE_YT_VIDEO,
    category: COMPONENT_CATEGORIES.YOUTUBE,
    icon: VerifyYouTubeLike,
  },
  {
    label: "Add custom on chain action",
    value: TYPES.CUSTOM_ONCHAIN_ACTION,
    icon: AddCustomOnChainAction,
    category: COMPONENT_CATEGORIES.CRYPTO,
  },
];

export const getMultipleChoiceDefaultValue = () => ({
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
});
