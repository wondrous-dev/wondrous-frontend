// step={step}
// startCmtyUserPolling={startPolling}
// stopCmtyUserPolling={stopPolling}
// cmtyUser={data?.getIntegrationCmtyUser}
// handleLinkClick={handleLinkClick}

import { useLazyQuery } from "@apollo/client";
import { SharedSecondaryButton } from "components/Shared/styles";
import { VERIFY_TWEET_LIKED } from "graphql/queries";
import { useMemo } from "react";
import { buildTwitterAuthUrl } from "utils/common";
import { LinkComponent } from "../LinkComponent";
import { useTakeQuest } from "utils/hooks";

const TwitterOauth = ({ telegramUserId, callback }) => {
  const state = `telegramUserId=${telegramUserId}`;
  const link = buildTwitterAuthUrl(state);

  const handleClick = () => {
    return callback?.();
  };

  return (
    <a href={link} target="__blank" onClick={handleClick}>
      <SharedSecondaryButton $reverse>Connect Twitter</SharedSecondaryButton>
    </a>
  );
};

export const VerifyLikeTweet = ({ step, startCmtyUserPolling, stopCmtyUserPolling, cmtyUser, handleLinkClick }) => {
  const tweetLink = step?.additionalData?.tweetLink;

  const { nextStep, onChange } = useTakeQuest();

  const [verifyLikeTweet, { data, error, loading }] = useLazyQuery(VERIFY_TWEET_LIKED);

  const tweetId = tweetLink.split("/").pop();
  const cleanedTweetId = tweetId?.split("?")[0];

  const handleCallback = () => setTimeout(() => startCmtyUserPolling(1000), 3000);

  const reconnectTwitterErrors = ["twitter_token_expired", "twitter_missing_scope", "twitter_not_connected"];
  const errorCode: any = error?.graphQLErrors[0]?.extensions.errorCode;

  if (!cmtyUser?.twitterInfo || reconnectTwitterErrors.includes(errorCode)) {
    return <TwitterOauth telegramUserId={cmtyUser?.telegramId} callback={handleCallback} />;
  }

  const handleClick = async () => {
    const { data, error } = await verifyLikeTweet({
      variables: {
        cmtyUserId: cmtyUser?.id,
        tweetId: cleanedTweetId,
      },
    });
    if (data?.verifyTweetLiked?.userLikedTweet) {
      onChange({
        id: step?.id,
        value: true,
      });
      return nextStep();
    }
  };
  const errorMessage = useMemo(() => {
    if (error?.graphQLErrors && error?.graphQLErrors[0]?.extensions.errorCode === "twitter_not_connected") {
      return "Twitter not connected, please connect your twitter account and try again";
    }
    if (error?.graphQLErrors && error?.graphQLErrors[0]?.extensions.errorCode === "twitter_missing_scope") {
      return "Proposal was not voted on, try again";
    }
    if (error) {
      return "Something went wrong. Please try again or contact support";
    }
    return null;
  }, [data, error]);

  return <LinkComponent error={errorMessage} onClick={handleClick} loading={loading} />;
};

export const VerifyFollowAccount = () => null;

export const VerifyReplyToTweet = () => null;

export const VerifyRetweet = () => null;
