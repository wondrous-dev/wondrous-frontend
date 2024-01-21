import DataCollectionComponent from "components/AddFormEntity/components/DataCollection";
import DiscordComponent from "components/AddFormEntity/components/DiscordComponent";
import QuizComponent from "components/AddFormEntity/components/QuizComponent";
import SnapshotComponent from "components/AddFormEntity/components/SnapshotComponent";
import TextComponent from "components/AddFormEntity/components/Text";
import TwitterComponent from "components/AddFormEntity/components/Twitter";
import { TYPES } from "./constants";
import VerifyTokenHoldingComponent from "components/AddFormEntity/components/VerifyTokenHolding";
import YoutubeLikeComponent from "components/AddFormEntity/components/YoutubeLikeComponent";
import YoutubeSubscribeComponent from "components/AddFormEntity/components/YoutubeSubscribeComponent";
import LinkClickComponent from "components/AddFormEntity/components/LinkClickComponent";
import LifiValueBridgeComponent from "components/AddFormEntity/components/LiFiValueBridgeComponent";
import ReferralComponent from "components/AddFormEntity/components/Referral";
import MigrateOriginUsers from "components/AddFormEntity/components/MigrateOriginUsers";
import VerifyMarketsFlareTrial from "components/AddFormEntity/components/VerifyMarketsFlareTrial";
import VerifyApeironIntegrations from "components/AddFormEntity/components/VerifyApeiron";
import ConnectWallet from "components/AddFormEntity/components/ConnectWallet";
import GitcoinPassportComponent from "components/AddFormEntity/components/GitcoinPassportComponent";

const APEIRON_INTEGRATIONS = {
  [TYPES.VERIFY_APEIRON_10_MINS_PLAYED]: VerifyApeironIntegrations,
  [TYPES.VERIFY_APEIRON_APOSTLES_IV_OVER_80]: VerifyApeironIntegrations,
  [TYPES.VERIFY_APEIRON_DEFEAT_FIRST_BOSS]: VerifyApeironIntegrations,
  [TYPES.VERIFY_APEIRON_ACCOUNT_BY_WALLET_ADDRESS]: VerifyApeironIntegrations,
};
export const CONFIG_COMPONENTS = {
  [TYPES.TEXT_FIELD]: TextComponent,
  [TYPES.MULTI_QUIZ]: QuizComponent,
  [TYPES.SINGLE_QUIZ]: QuizComponent,
  [TYPES.NUMBER]: TextComponent,
  [TYPES.ATTACHMENTS]: TextComponent,
  [TYPES.LIKE_TWEET]: TwitterComponent,
  [TYPES.FOLLOW_TWITTER]: TwitterComponent,
  [TYPES.REPLY_TWEET]: TwitterComponent,
  [TYPES.RETWEET]: TwitterComponent,
  [TYPES.TWEET_WITH_PHRASE]: TwitterComponent,
  [TYPES.SNAPSHOT_PROPOSAL_VOTE]: SnapshotComponent,
  [TYPES.SNAPSHOT_SPACE_VOTE]: SnapshotComponent,
  [TYPES.DISCORD_MESSAGE_IN_CHANNEL]: DiscordComponent,
  [TYPES.CONNECT_WALLET]: ConnectWallet,
  [TYPES.DATA_COLLECTION]: DataCollectionComponent,
  [TYPES.VERIFY_TOKEN_HOLDING]: VerifyTokenHoldingComponent,
  [TYPES.LIKE_YT_VIDEO]: YoutubeLikeComponent,
  [TYPES.SUBSCRIBE_YT_CHANNEL]: YoutubeSubscribeComponent,
  [TYPES.LINK_CLICK]: LinkClickComponent,
  [TYPES.DISCORD_EVENT_ATTENDANCE]: DiscordComponent,
  [TYPES.LIFI_VALUE_BRIDGED]: LifiValueBridgeComponent,
  [TYPES.REFERRAL]: ReferralComponent,
  [TYPES.MIGRATE_ORIGIN_USERS]: MigrateOriginUsers,
  [TYPES.VERIFY_MARKETSFLARE_TRIAL]: VerifyMarketsFlareTrial,
  [TYPES.VERIFY_GITCOIN_PASSPORT_SCORE]: GitcoinPassportComponent,
  ...APEIRON_INTEGRATIONS,
};
