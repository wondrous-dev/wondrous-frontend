import { useLocation } from "react-router-dom";
import { useMe } from "components/Auth";
import { config } from "./config";
import { Grid } from "@mui/material";
import { getStepsConfig } from "./utils";

export const filterGuideSteps = ({ steps, user, router }) => {
  const onProjectHome = router.pathname === "/organization/[username]/home" || router.pathname === "/pod/[podId]/home";
  if (user?.lastCompletedGuide && onProjectHome) {
    return steps.slice(1);
  }
  return steps;
};

function NavigationWrapper({ nextButton, prevButton, currentStep, setIsOpen, setCurrentStep }) {
  const location = useLocation();
  const { steps } = getStepsConfig(location.pathname);

  const NextBtn: any = nextButton;
  const PrevBtn: any = prevButton;
  const currentStepConfig = steps[currentStep];
  const hideButtons = currentStepConfig?.hideButtons;
  const EndButton = currentStepConfig?.endButton;
  return (
    <Grid
      display="flex"
      justifyContent="space-between"
      gap="32px"
      padding="16px"
      sx={{
        borderTop: "1px solid #E8E8E8",
      }}
    >
      {(!hideButtons || !EndButton) && (
        <>
          <PrevBtn currentStep={currentStep} setIsOpen={setIsOpen} setCurrentStep={setCurrentStep} />
          <NextBtn currentStep={currentStep} setIsOpen={setIsOpen} setCurrentStep={setCurrentStep} />
        </>
      )}
      {EndButton ? <EndButton onClick={() => setIsOpen(false)} /> : null}
    </Grid>
  );
}

export default NavigationWrapper;
