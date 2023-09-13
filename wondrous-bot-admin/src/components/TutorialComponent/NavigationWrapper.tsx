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
  return (
    <Grid
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap="32px"
      padding="16px"
      sx={{
        borderTop: "1px solid #E8E8E8",
      }}
    >
      {(!hideButtons || !EndButton) && (
        <>
          <PrevBtn currentStep={currentStep} setIsOpen={setIsOpen} setCurrentStep={setCurrentStep} />
          <Typography fontSize="14px" fontFamily="Poppins" color="#828282" fontWeight={500} whiteSpace="nowrap">
            {currentStep + 1} of {steps?.length}
          </Typography>
          <NextBtn currentStep={currentStep} setIsOpen={setIsOpen} setCurrentStep={setCurrentStep} />
        </>
      )}
      {EndButton ? <EndButton onClick={() => setIsOpen(false)} /> : null}
    </Grid>
  );
}

export default NavigationWrapper;
