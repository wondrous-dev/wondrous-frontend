import { get } from "lodash";
import { useLazyQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { SharedSecondaryButton } from "components/Shared/styles";
import { buildTwitterAuthUrl } from "utils/common";
import { useTakeQuest } from "utils/hooks";
import { DEFAULT_BANNER_IMAGES, TYPES } from "utils/constants";
import { Grid } from "@mui/material";
import { Image } from "components/QuestSteps/styles";
import {
  VERIFY_TWEET_LIKED,
  VERIFY_TWEET_REPLIED,
  VERIFY_TWEET_RETWEETED,
  VERIFY_TWEET_WITH_PHRASE,
  VERIFY_TWITTER_FOLLOW,
} from "graphql/queries";
import { LinkComponent } from "../LinkComponent";

const QUERY_MAP = {
  [TYPES.LIKE_TWEET]: VERIFY_TWEET_LIKED,
  [TYPES.FOLLOW_TWITTER]: VERIFY_TWITTER_FOLLOW,
  [TYPES.REPLY_TWEET]: VERIFY_TWEET_REPLIED,
  [TYPES.RETWEET]: VERIFY_TWEET_RETWEETED,
  [TYPES.TWEET_WITH_PHRASE]: VERIFY_TWEET_WITH_PHRASE,
};

const ERRORS_MAP = {
  [TYPES.LIKE_TWEET]: "Looks like you haven't liked this tweet yet. Please try again or contact support",
  [TYPES.FOLLOW_TWITTER]: "Looks like you haven't followed this account yet. Please try again or contact support",
  [TYPES.REPLY_TWEET]: "Looks like you haven't replied to this tweet yet. Please try again or contact support",
  [TYPES.RETWEET]: "Looks like you haven't retweeted this tweet yet. Please try again or contact support",
  [TYPES.TWEET_WITH_PHRASE]: "Looks like you haven't tweeted with this phrase yet. Please try again or contact support",
};

const TwitterOauth = ({ telegramUserId, callback }) => {
  const state = `telegramUserId=${telegramUserId}`;
  const link = buildTwitterAuthUrl(state);

  const { webApp } = useTakeQuest();

  const handleLinkClick = () => {
    callback();
    webApp?.openLink(link, {
      try_instant_view: false,
    });
  };

  return (
    <SharedSecondaryButton onClick={handleLinkClick} $reverse>
      Connect Twitter
    </SharedSecondaryButton>
  );
};

const TwitterActionVerifier = ({ step, startCmtyUserPolling, cmtyUser, handleLinkClick, stopCmtyUserPolling }) => {
  const [errorCode, setErrorCode] = useState(null);
  const { nextStep, onChange } = useTakeQuest();
  const query = QUERY_MAP[step.type];
  const [error, setError] = useState("");
  const reconnectTwitterErrors = ["twitter_token_expired", "twitter_missing_scope", "twitter_not_connected"];
  const [invokeQuery, { data, error: errorObj, loading }] = useLazyQuery(query, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    onError: (error) => {
      setErrorCode(error?.graphQLErrors[0]?.extensions.errorCode);
    },
  });

  const getPathToResponse = (type) => {
    if (type === TYPES.LIKE_TWEET) return "verifyTweetLiked.userLikedTweet";
    if (type === TYPES.RETWEET) return "verifyTweetRetweeted.userRetweetedTweet";

    if (type === TYPES.FOLLOW_TWITTER) return "verifyTwitterFollow.userFollowed";

    if (type === TYPES.REPLY_TWEET) return "verifyTweetReplied.userRepliedToTweet";

    if (type === TYPES.TWEET_WITH_PHRASE) return "verifyTweetWithPhrase.userTweetedWithPhrase";
    return "";
  };

  const errorMessage = useMemo(() => {
    if (reconnectTwitterErrors.includes(errorCode)) {
      return "Please reconnect your account";
    }
    if (!!errorObj) {
      return "Something went wrong. Please try again or contact support";
    }
    return null;
  }, [errorCode, !!errorObj, step.type, data]);

  if (!cmtyUser?.twitterInfo || reconnectTwitterErrors.includes(errorCode)) {
    return (
      <TwitterOauth
        telegramUserId={cmtyUser?.telegramId}
        callback={() => {
          setErrorCode(null);
          setTimeout(() => startCmtyUserPolling(1000), 3000);
        }}
      />
    );
  }

  const generateVariables = () => {
    let variables: any = { cmtyUserId: cmtyUser?.id };
    switch (step.type) {
      case TYPES.LIKE_TWEET:
      case TYPES.RETWEET:
      case TYPES.REPLY_TWEET:
        const tweetLink = step?.additionalData?.tweetLink;
        const tweetId = tweetLink.split("/").pop();
        variables.tweetId = tweetId?.split("?")[0];
        break;
      case TYPES.FOLLOW_TWITTER:
        variables.tweetHandle = step?.additionalData?.tweetHandle;
        break;
      case TYPES.TWEET_WITH_PHRASE:
        variables.tweetPhrase = step?.additionalData?.tweetPhrase;
        break;
      default:
        break;
    }
    return variables;
  };

  const handleClick = async () => {
    const variables: any = generateVariables();
    setErrorCode(null);
    setError("");
    const pathToResponse = getPathToResponse(step.type);
    const { data } = await invokeQuery({ variables });
    const value = get(data, pathToResponse);
    if (data && value) {
      onChange({ id: step?.id, value: true });
      nextStep();
      return;
    }
    if (value === false) {
      setError(ERRORS_MAP[step.type]);
    }
  };

  return (
    <Grid display="flex" flexDirection="column" gap="24px">
      <Image src={DEFAULT_BANNER_IMAGES.QUEST_STEP_TWITTER} width="100%" />
      <LinkComponent error={error || errorMessage} onClick={handleClick} loading={loading} />
    </Grid>
  );
};

export default TwitterActionVerifier;
