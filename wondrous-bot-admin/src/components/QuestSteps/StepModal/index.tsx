import { Grid, Box, Typography, ButtonBase } from "@mui/material";
import { BotIcon } from "assets/botIcon";
import { SharedSecondaryButton } from "components/Shared/styles";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { useTakeQuest } from "utils/hooks";

export const StepModal = ({ children, step, disabled, nextStepId }) => {
  const { nextStep, handleSubmit } = useTakeQuest();

  return (
    <Grid display="flex" flexDirection="column" gap="24px" width="100%">
      <Grid display="flex" flexDirection="column" gap="10px" width="100%">
        <StyledViewQuestResults>Quest Step {step.order}</StyledViewQuestResults>
        <Box display="flex" gap="14px" alignItems="center">
          <BotIcon />
          <Box bgcolor="#EEE" padding="12px" flex="1 1 0" borderLeft="4px solid #2A8D5C">
            <Typography color="#1D1D1D" fontFamily="Poppins" fontSize="16px" fontWeight={500} lineHeight="24px">
              {step.prompt}
            </Typography>
          </Box>
        </Box>
      </Grid>
      {children}
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
    </Grid>
  );
};
