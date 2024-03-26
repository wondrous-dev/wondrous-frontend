import { useLazyQuery } from "@apollo/client";
import { Box, Grid } from "@mui/material";
import { Label } from "components/AddFormEntity/components/styles";
import Spinner from "components/Shared/Spinner";
import { ErrorText, SharedSecondaryButton } from "components/Shared/styles";
import {
  GET_CMTY_USER_INFO,
  GET_INTEGRATION_CMTY_USER,
  VERIFY_LINK_CLICKED,
  VERIFY_SNAPSHOT_PROPOSAL_VOTE,
  VERIFY_SNAPSHOT_SPACE_VOTE,
  VERIFY_TOKEN_HOLDING,
  VERIFY_YT_LIKED,
  VERIFY_YT_SUBSCRIPTION,
} from "graphql/queries";
import { getGoogleOauthUrl } from "pages/oauth/google/callback";
import { useEffect, useMemo } from "react";
import { getYouTubeVideoId } from "services/validators/customValidation";
import { getBaseUrl, getWeb3ConnectUrl, getYoutubeChannelId } from "utils/common";
import { TYPES } from "utils/constants";
import { useTakeQuest } from "utils/hooks";
import TwitterActionVerifier from "./TwitterComponents";
import { LinkComponent } from "./LinkComponent";

const GoogleVerify = ({ telegramUserId, callback }) => {
  const handleClick = () => {
    return callback?.();
  };
  const link = getGoogleOauthUrl({ telegramUserId });

  return (
    <a href={link} target="__blank" onClick={handleClick}>
      <SharedSecondaryButton $reverse>Connect Google</SharedSecondaryButton>
    </a>
  );
};

export const Web3Connect = ({ telegramUserId, callback }) => {
  const handleClick = () => {
    return callback?.();
  };
  const link = getWeb3ConnectUrl({ telegramUserId });
  return (
    <a href={link} target="__blank" onClick={handleClick}>
      <SharedSecondaryButton $reverse>Connect Wallet</SharedSecondaryButton>
    </a>
  );
};

const LinkClickButton = ({ step, cmtyUser, handleLinkClick, startCmtyUserPolling }) => {
  const { nextStep, onChange } = useTakeQuest();
  const [verifyLinkClick, { startPolling, stopPolling, loading }] = useLazyQuery(VERIFY_LINK_CLICKED, {
    onCompleted: (data) => {
      if (data?.verifyLinkClicked?.success) {
        stopPolling();
        onChange({
          id: step?.id,
          value: true,
        });
        nextStep();
      }
    },
  });

  const link = useMemo(() => {
    const baseUrl = getBaseUrl();
    const url = step?.additionalData?.linkClickUrl;
    const linkQuery = JSON.stringify({
      url,
      cmtyUserId: cmtyUser?.id,
      questStepId: step?.id,
    });
    const query = btoa(linkQuery);
    return `${baseUrl}/verify-link?query=${encodeURIComponent(query)}`;
  }, [step]);

  const onClick = async () => {
    return handleLinkClick({
      action: async () => {
        await verifyLinkClick({
          variables: {
            cmtyUserId: cmtyUser?.id,
            url: step?.additionalData?.linkClickUrl,
            questStepId: step?.id,
          },
        });
        startPolling(1000);
      },
      callback: stopPolling(),
      timeout: 30000,
    });
  };
  return <LinkComponent loading={loading} link={link} onClick={onClick} />;
};

const YoutubeButton = ({ step, cmtyUser, startCmtyUserPolling, stopCmtyUserPolling }) => {
  const { nextStep, onChange } = useTakeQuest();
  const [verifyYoutubeSubscription, { loading: ytSubscriptionLoading, error, data: ytData }] =
    useLazyQuery(VERIFY_YT_SUBSCRIPTION);

  const [verifyYoutubeLike, { loading: ytLikeLoading, error: ytLikeError }] = useLazyQuery(VERIFY_YT_LIKED);

  const [getCmtyUserInfo, { data, startPolling: startCmtyUserInfoPolling, stopPolling: stopCmtyUserInfoPolling }] =
    useLazyQuery(GET_CMTY_USER_INFO, {
      notifyOnNetworkStatusChange: true,
    });

  useEffect(() => {
    if (data?.getCmtyUserInfo?.googleInfo) {
      stopCmtyUserInfoPolling();
    }
  }, [data?.getCmtyUserInfo?.googleInfo, stopCmtyUserInfoPolling]);

  const ytChannelLink = step?.additionalData?.ytChannelLink;
  const ytInfo = useMemo(() => {
    let data = {
      channelId: null,
      channelHandle: null,
      videoId: null,
    };

    switch (step?.type) {
      case TYPES.LIKE_YT_VIDEO:
        data.videoId = getYouTubeVideoId(step?.additionalData?.ytVideoLink);
        break;
      case TYPES.SUBSCRIBE_YT_CHANNEL:
        const channelData = getYoutubeChannelId(ytChannelLink);
        data.channelId = channelData?.channelId;
        data.channelHandle = channelData?.channelHandle;
        break;
      default:
        break;
    }

    return data;
  }, [ytChannelLink, step?.additionalData?.ytVideoLink, step?.type]);

  const handleVerifySubscription = async () => {
    const { data, error } = await verifyYoutubeSubscription({
      variables: {
        cmtyUserId: cmtyUser?.id,
        channelId: ytInfo?.channelId,
        channelHandle: ytInfo?.channelHandle,
      },
    });
    if (data?.verifyYoutubeSubscription?.subscribed) {
      onChange({
        id: step?.id,
        value: true,
      });
      return nextStep();
    }
  };

  const handleVerifyLike = async () => {
    const { data, error } = await verifyYoutubeLike({
      variables: {
        cmtyUserId: cmtyUser?.id,
        videoId: ytInfo?.videoId,
      },
    });
    if (data?.verifyYoutubeVideoLike?.liked) {
      onChange({
        id: step?.id,
        value: true,
      });
      return nextStep();
    }
  };

  useEffect(() => {
    getCmtyUserInfo({
      variables: {
        cmtyUserId: cmtyUser?.id,
      },
    });
  }, []);

  if (!data?.getCmtyUserInfo?.cmtyUserId) {
    return <Spinner />;
  }

  const googleVerifyCallback = () => {
    setTimeout(() => startCmtyUserInfoPolling(1000), 3000);
  };

  const errorObject = error || ytLikeError;

  if (
    !data?.getCmtyUserInfo?.googleInfo ||
    errorObject?.graphQLErrors?.[0]?.extensions?.errorCode === "google_not_authorized"
  ) {
    return <GoogleVerify callback={googleVerifyCallback} telegramUserId={cmtyUser?.telegramId} />;
  }

  const onClick = () => {
    if (step.type === TYPES.LIKE_YT_VIDEO) {
      return handleVerifyLike();
    }
    return handleVerifySubscription();
  };

  return (
    <LinkComponent
      link={step?.additionalData?.ytChannelLink || step?.additionalData?.ytVideoLink}
      onClick={onClick}
      loading={ytSubscriptionLoading}
      error={
        errorObject?.graphQLErrors?.[0]?.extensions?.errorCode === "google_api_error"
          ? "Youtube API is acting up! please try again :)"
          : null
      }
    />
  );
};

const SnapshotButton = ({ step, cmtyUser, handleLinkClick, startCmtyUserPolling, stopCmtyUserPolling }) => {
  const snapshotProposalLink = step?.additionalData?.snapshotProposalLink;
  const snapshotSpaceLink = step?.additionalData?.snapshotSpaceLink;
  const snapshotVoteTimes = step?.additionalData?.snapshotVoteTimes;

  const isProposalType = step.type === TYPES.SNAPSHOT_PROPOSAL_VOTE;

  const { onChange, nextStep } = useTakeQuest();

  const [
    verifySnapshotProposalVote,
    { loading, error, data, startPolling: startProposalPolling, stopPolling: stopProposalPolling },
  ] = useLazyQuery(VERIFY_SNAPSHOT_PROPOSAL_VOTE, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data?.verifySnapshotProposalVote?.userVotedProposal) {
        stopSpacePolling();
        onChange({
          id: step?.id,
          value: true,
        });
        return nextStep();
      }
    },
  });

  const [
    verifySnapshotSpaceVote,
    {
      loading: spaceLoading,
      error: spaceVoteError,
      data: spaceData,
      startPolling: startSpacePolling,
      stopPolling: stopSpacePolling,
    },
  ] = useLazyQuery(VERIFY_SNAPSHOT_SPACE_VOTE, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data?.verifySnapshotSpaceVote?.userVotedSpace) {
        stopSpacePolling();
        onChange({
          id: step?.id,
          value: true,
        });
        return nextStep();
      }
    },
  });

  const errorObj = error || spaceVoteError;

  const web3VerifyCallback = () => {
    setTimeout(() => startCmtyUserPolling(1000), 3000);
  };

  const handleVerifyProposalVote = async () => {
    const proposalId = snapshotProposalLink?.split("/")[6];

    // TODO: on the API, switch to use only cmtyUser ID instead of telegram / discord ids
    const { data } = await verifySnapshotProposalVote({
      variables: {
        telegramUserId: cmtyUser.telegramId,
        proposalId,
      },
    });
    if (data?.verifySnapshotProposalVote?.userVotedProposal === false) {
      startProposalPolling(1000);
      setTimeout(() => stopProposalPolling(), 30000);
    }
  };

  const handleVerifySpaceVotes = async () => {
    const { data } = await verifySnapshotSpaceVote({
      variables: {
        telegramUserId: cmtyUser.telegramId,
        stepId: step.id,
        voteTimes: step?.additionalData?.snapshotVoteTimes,
      },
    });
    if (data?.verifySnapshotSpaceVote?.userVotedSpace === false) {
      startProposalPolling(1000);
      setTimeout(() => stopProposalPolling(), 30000);
    }
  };

  const onClick = () => {
    if (isProposalType) {
      return handleVerifyProposalVote();
    }
    return handleVerifySpaceVotes();
  };

  const errorMessage = useMemo(() => {
    if (spaceData?.verifySnapshotSpaceVote?.userVotedSpace === false) {
      return "You did not vote in the space the correct number of times, please try again";
    }
    if (data?.verifySnapshotProposalVote?.userVotedProposal === false) {
      return "Proposal was not voted on, try again";
    }
    if (errorObj) {
      return "Something went wrong. Please try again or contact support";
    }
    return null;
  }, [spaceData, data, errorObj]);

  if (!cmtyUser?.web3Address) {
    return <Web3Connect telegramUserId={cmtyUser.telegramId} callback={web3VerifyCallback} />;
  }

  return (
    <LinkComponent
      linkText={isProposalType ? "Visit Proposal" : "Visit Space"}
      error={errorMessage}
      link={snapshotProposalLink || snapshotSpaceLink}
      onClick={onClick}
      loading={loading || spaceLoading}
    />
  );
};

const VerifyTokenHoldingButton = ({ step, startCmtyUserPolling, stopCmtyUserPolling, cmtyUser, handleLinkClick }) => {
  const { nextStep, onChange } = useTakeQuest();

  const tokenChain = step?.additionalData?.tokenChain;
  const tokenAddress = step?.additionalData?.tokenAddress;
  const tokenAmount = step?.additionalData?.tokenAmount;
  const tokenType = step?.additionalData?.tokenType;
  const tokenDecimals = step?.additionalData?.tokenDecimals;
  const tokenId = step?.additionalData?.tokenId;

  const [verifyTokenHolding, { loading, data }] = useLazyQuery(VERIFY_TOKEN_HOLDING, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.verifyTokenHolding?.userHasTokens) {
        onChange({
          id: step?.id,
          value: true,
        });
        nextStep();
      }
    },
  });

  const onClick = async () => {
    return handleLinkClick({
      action: async () => {
        verifyTokenHolding({
          variables: {
            telegramUserId: cmtyUser?.telegramId?.toString(),
            tokenChain,
            tokenAddress,
            tokenAmount,
            tokenType,
            tokenDecimals,
            tokenId
          },
        });
      },
    });
  };

  const web3VerifyCallback = () => {
    setTimeout(() => startCmtyUserPolling(1000), 3000);
  };

  if (!cmtyUser?.web3Address) {
    return <Web3Connect telegramUserId={cmtyUser.telegramId} callback={web3VerifyCallback} />;
  }

  return (
    <LinkComponent
      error={data?.verifyTokenHolding?.userHasTokens === false ? "You don't hold enough tokens" : ""}
      loading={loading}
      onClick={onClick}
    />
  );
};

const COMPONENTS = {
  [TYPES.LINK_CLICK]: LinkClickButton,
  [TYPES.SUBSCRIBE_YT_CHANNEL]: YoutubeButton,
  [TYPES.LIKE_YT_VIDEO]: YoutubeButton,
  [TYPES.SNAPSHOT_PROPOSAL_VOTE]: SnapshotButton,
  [TYPES.SNAPSHOT_SPACE_VOTE]: SnapshotButton,
  [TYPES.VERIFY_TOKEN_HOLDING]: VerifyTokenHoldingButton,
  [TYPES.LIKE_TWEET]: TwitterActionVerifier,
  [TYPES.FOLLOW_TWITTER]: TwitterActionVerifier,
  [TYPES.REPLY_TWEET]: TwitterActionVerifier,
  [TYPES.RETWEET]: TwitterActionVerifier,
  [TYPES.TWEET_WITH_PHRASE]: TwitterActionVerifier,
};

export const VerifyButton = ({ step }) => {
  const [getIntegrationCmtyUser, { data, refetch, loading, startPolling, stopPolling }] = useLazyQuery(
    GET_INTEGRATION_CMTY_USER,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  const handleLinkClick = async ({ action, callback, timeout = 3000 }) => {
    if (action) {
      await action();
    }

    callback &&
      setTimeout(() => {
        callback?.();
      }, timeout);
  };

  const { telegramUser } = useTakeQuest();

  const handleFetch = async () => {
    const { data } = await getIntegrationCmtyUser({
      variables: {
        telegramUserId: telegramUser?.id?.toString(),
      },
    });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  if (!data?.getIntegrationCmtyUser?.id) {
    return (
      <Grid display="flex" justifyContent="center" alignItems="center">
        <Spinner />
      </Grid>
    );
  }

  const Component = COMPONENTS[step.type];

  return (
    <Grid display="flex" justifyContent="center" flexDirection="column" alignItems="center" gap="24px">
      {Component ? (
        <Component
          step={step}
          startCmtyUserPolling={startPolling}
          stopCmtyUserPolling={stopPolling}
          cmtyUser={data?.getIntegrationCmtyUser}
          handleLinkClick={handleLinkClick}
        />
      ) : null}
    </Grid>
  );
};
