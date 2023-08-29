import { Grid, Box, Typography, ButtonBase } from "@mui/material";
import { BotIcon } from "assets/botIcon";
import { SharedSecondaryButton } from "components/Shared/styles";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { useMemo } from "react";
import { TYPES } from "utils/constants";
import { useTakeQuest } from "utils/hooks";

const PromptComponent = ({ step }) => {
  const snapshotVoteTimes = step?.additionalData?.snapshotVoteTimes;

  const content = useMemo(() => {
    if (step.prompt) {
      return step.prompt;
    }
    if(step.type === TYPES.LINK_CLICK) {
      return 'Click on the link below to verify'
    }
    if(step.type === TYPES.LIKE_YT_VIDEO) {
      return 'Verify YouTube Like'
    }
    if(step.type === TYPES.SUBSCRIBE_YT_CHANNEL) {
      return 'Verify YouTube Subscription'
    }
    if(step.type === TYPES.SNAPSHOT_PROPOSAL_VOTE) {
      return 'Please vote on this proposal'
    }
    if(step.type === TYPES.SNAPSHOT_SPACE_VOTE) {
      return `Please vote in this space at least ${snapshotVoteTimes} times`
    }
    return null;
  }, [step.prompt, step.type, snapshotVoteTimes]);

  return (
    <Typography color="#1D1D1D" fontFamily="Poppins" fontSize="16px" fontWeight={500} lineHeight="24px">
      {content}
    </Typography>
  );
};

export const StepModal = ({ children, step, disabled, nextStepId }) => {
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
