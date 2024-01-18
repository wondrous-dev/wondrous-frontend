import { useLocation } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import { useTour } from "@reactour/tour";

function NavigationWrapper({ nextButton, prevButton, currentStep, setIsOpen, setCurrentStep }) {
  const location = useLocation();
  const { steps } = useTour();

  const NextBtn: any = nextButton;
  const PrevBtn: any = prevButton;
  const currentStepConfig: any = steps[currentStep];
  const hideButtons = currentStepConfig?.hideButtons;
  const EndButton = currentStepConfig?.endButton;

  if (hideButtons) return null;

  return (
    <Grid
      display="flex"
      justifyContent={currentStepConfig.alignCenter ? "center" : "space-between"}
      alignItems="center"
      gap="32px"
      padding="16px"
      sx={{
        borderTop: "1px solid #E8E8E8",
      }}
    >
      {(!hideButtons || !EndButton) && (
        <>
          {currentStepConfig?.hidePrevButton ? null : (
            <PrevBtn currentStep={currentStep} setIsOpen={setIsOpen} setCurrentStep={setCurrentStep} />
          )}
          {currentStepConfig?.hidePrevButton || currentStepConfig?.hideNextButton ? null : <Box flex="1" />}
          {currentStepConfig?.hideNextButton ? null : (
            <NextBtn currentStep={currentStep} setIsOpen={setIsOpen} setCurrentStep={setCurrentStep} />
          )}
        </>
      )}
      {EndButton ? <EndButton onClick={() => setIsOpen(false)} /> : null}
    </Grid>
  );
}

export default NavigationWrapper;
