import { Grid, Box, Typography, ButtonBase } from "@mui/material";
import { BotIcon } from "assets/botIcon";
import { SharedSecondaryButton } from "components/Shared/styles";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { useMemo } from "react";
import { TYPES } from "utils/constants";
import { useTakeQuest } from "utils/hooks";

const ContentComponent = ({ link = null, prompt }) => {
  const { webApp } = useTakeQuest();
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    webApp?.openLink(link, {
      try_instant_view: false,
    });
  };

  return (
    <Grid display="flex" flexDirection="column" gap="14px">
      <Typography color="#1D1D1D" fontFamily="Poppins" fontSize="16px" fontWeight={500} lineHeight="24px">
        {prompt}
      </Typography>
      {link ? (
        <ButtonBase sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start" }}>
          <a href="#" onClick={handleClick}>
            Link
          </a>
        </ButtonBase>
      ) : null}
    </Grid>
  );
};

const PromptComponent = ({ step }) => {
  const snapshotVoteTimes = step?.additionalData?.snapshotVoteTimes;

  const tweetLink = step?.additionalData?.tweetLink;
  const tokenName = step?.additionalData?.tokenName;
  const content = useMemo(() => {
    if (step.prompt) {
      return step.prompt;
    }
    if (step.type === TYPES.LINK_CLICK) {
      return "Click on the link below to verify";
    }
    if (step.type === TYPES.LIKE_YT_VIDEO) {
      return "Verify YouTube Like";
    }
    if (step.type === TYPES.SUBSCRIBE_YT_CHANNEL) {
      return "Verify YouTube Subscription";
    }
    if (step.type === TYPES.SNAPSHOT_PROPOSAL_VOTE) {
      return "Please vote on this proposal";
    }
    if (step.type === TYPES.SNAPSHOT_SPACE_VOTE) {
      return `Please vote in this space at least ${snapshotVoteTimes} times`;
    }
    if (step.type === TYPES.VERIFY_TOKEN_HOLDING) {
      return `Press to verify ${tokenName || "token"} holdings`;
    }
    if (step.type === TYPES.LIKE_TWEET) {
      return () => <ContentComponent link={tweetLink} prompt={"Like the tweet below to verify"} />;
    }
    if (step.type === TYPES.FOLLOW_TWITTER) {
      const tweetHandle = step?.additionalData?.tweetHandle;
      return (
        <Grid display="flex" flexDirection="column" gap="14px">
          <Typography color="#1D1D1D" fontFamily="Poppins" fontSize="16px" fontWeight={500} lineHeight="24px">
            Follow this account:
          </Typography>
          <a href={`https://twitter.com/${tweetHandle}`}>@{tweetHandle}</a>
        </Grid>
      );
    }
    if (step.type === TYPES.REPLY_TWEET) {
      const tweetLink = step?.additionalData?.tweetLink;
      return () => <ContentComponent prompt="Reply to this tweet:" link={tweetLink} />;
    }
    if (step.type === TYPES.TWEET_WITH_PHRASE) {
      const tweetPhrase = step?.additionalData?.tweetPhrase;
      return () => <ContentComponent prompt={`Tweet with this phrase: ${tweetPhrase}`} />;
    }
    if (step.type === TYPES.RETWEET) {
      const tweetLink = step?.additionalData?.tweetLink;
      return () => <ContentComponent prompt="Retweet this tweet:" link={tweetLink} />;
    }
    return null;
  }, [step.prompt, step.type, step?.additionalData]);

  return typeof content === "function" ? (
    content()
  ) : (
    <Typography
      color="#1D1D1D"
      fontFamily="Poppins"
      fontSize="16px"
      fontWeight={500}
      lineHeight="24px"
      sx={{
        wordBreak: "break-word",
      }}
    >
      {content}
    </Typography>
  );
};

export const StepModal = ({ children, step, disabled }) => {
  const { nextStep, isEditMode } = useTakeQuest();

  return (
    <Grid display="flex" flexDirection="column" gap="24px" width="100%">
      <Grid display="flex" flexDirection="column" gap="10px" width="100%">
        <StyledViewQuestResults>Quest Step {step.order}</StyledViewQuestResults>
        <Box display="flex" gap="14px" alignItems="center">
          <BotIcon />
          <Box bgcolor="#EEE" padding="12px" flex="1 1 0" borderLeft="4px solid #2A8D5C">
            <PromptComponent step={step} />
          </Box>
        </Box>
      </Grid>
      {children}
      {isEditMode ? null : (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap="14px">
          <SharedSecondaryButton onClick={nextStep} disabled={disabled}>
            Next
          </SharedSecondaryButton>
          {step?.required ? null : (
            <ButtonBase onClick={nextStep}>
              <Typography fontFamily="Poppins" fontWeight={600} fontSize="15px" lineHeight="150%" color="#0c002d">
                Skip Step
              </Typography>
            </ButtonBase>
          )}
        </Box>
      )}
    </Grid>
  );
};
