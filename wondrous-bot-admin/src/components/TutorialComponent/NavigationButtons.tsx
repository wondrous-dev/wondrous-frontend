import { useTour } from "@reactour/tour";
import { useMe } from "components/Auth";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { config } from "./config";
import { getStepsConfig } from "./utils";

export function NextNavigationButton({
  currentStep,
  setIsOpen,
  setCurrentStep,
  buttonProps = {}
}) {
  const {meta, setMeta} = useTour();
  const navigate = useNavigate()
  const {steps}:any = useTour();
  const stepsData = steps[currentStep];
  const buttonTitle = stepsData?.nextButtonTitle || 'Next';
  const action = async () => {
    if(stepsData?.nextHref && meta) {
      navigate(stepsData?.nextHref.replace(':id', meta))
      setMeta(null)
    }
    if (currentStep === steps.length - 1) {
      return setIsOpen(false);
    }
    if(stepsData?.handleNextAction) {
      return stepsData?.handleNextAction?.()
    }
    return setCurrentStep((step) => step + 1);
  };
  if (stepsData?.nextAction === 'skip') {
    return null;
  }
  return (
    <SharedSecondaryButton type="button" onClick={action}>
      {buttonTitle}
    </SharedSecondaryButton>
  );
}


export function PrevNavigationButton({
  currentStep,
  setIsOpen,
  setCurrentStep,
  buttonProps = {}
}) {
  const {steps}:any = useTour();
  const stepsData = steps[currentStep];
  const buttonTitle = stepsData?.prevButtonTitle || 'Previous';
  
  const action = () => {
    if (currentStep === 0 || stepsData.prevAction === 'skip') {
      return setIsOpen(false);
    }
    if(stepsData?.handlePrevAction) {
      return stepsData?.handlePrevAction?.()
    }
    return setCurrentStep((step) => step - 1);
  };
  return (
    <SharedSecondaryButton type="button" onClick={action} $reverse>
      {buttonTitle}
    </SharedSecondaryButton>
  );
}

