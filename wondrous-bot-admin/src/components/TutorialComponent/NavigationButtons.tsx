import { useTour } from "@reactour/tour";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useNavigate } from "react-router-dom";
import useSkipTour from "./Tutorials/shared/useSkipTour";
import { ButtonBase, Typography } from "@mui/material";
import { useContext } from "react";
import { TourDataContext } from "utils/context";

export function NextNavigationButton({ currentStep, setIsOpen, setCurrentStep, buttonProps = {} }) {
  const navigate = useNavigate();
  const { steps }: any = useTour();
  const stepsData = steps[currentStep];
  const buttonTitle = stepsData?.nextButtonTitle || "Next Step";

  const action = async () => {
    if (stepsData?.forceNextStep) {
      const nextStep = stepsData?.forceNextStep(currentStep);
      return setCurrentStep(nextStep);
    }
    if (stepsData?.handleNextAction) {
      return stepsData?.handleNextAction?.();
    }

    if (currentStep === steps.length - 1) {
      return setIsOpen(false);
    }
    return setCurrentStep((step) => step + 1);
  };
  if (stepsData?.nextAction === "skip") {
    return null;
  }
  return (
    <SharedSecondaryButton type="button" onClick={action}>
      {buttonTitle}
    </SharedSecondaryButton>
  );
}

export function PrevNavigationButton({ currentStep, setIsOpen, setCurrentStep, buttonProps = {} }) {
  const { steps, meta }: any = useTour();
  const { handleTourVisit } = useContext(TourDataContext);
  const stepsData = steps[currentStep];
  const { skipTour } = useSkipTour();

  const prevButtonTypographyStyles = stepsData?.prevButtonTypographyStyles;

  const handleExitTour = () => {
    skipTour();
    console.log(meta, "meta");
    // handleTourVisit(meta);
  };
  return (
    <ButtonBase onClick={handleExitTour}>
      <Typography
        color="#949494"
        fontFamily="Poppins"
        fontSize="15px"
        fontWeight={500}
        sx={{
          textDecoration: "underline",
        }}
        {...prevButtonTypographyStyles}
      >
        Exit Tour
      </Typography>
    </ButtonBase>
  );
}
