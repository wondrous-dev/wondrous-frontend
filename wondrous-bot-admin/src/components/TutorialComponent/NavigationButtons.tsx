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
  const location = useLocation();
  const {steps} = getStepsConfig(location.pathname);
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
  const location = useLocation();
  const { steps } = getStepsConfig(location.pathname);
  const stepsData = steps[currentStep];
  const buttonTitle = stepsData?.prevButtonTitle || 'Previous';

  const action = () => {
    if (currentStep === 0 || stepsData.prevAction === 'skip') {
      return setIsOpen(false);
    }
    return setCurrentStep((step) => step - 1);
  };
  return (
    <SharedSecondaryButton type="button" onClick={action} $reverse>
      {buttonTitle}
    </SharedSecondaryButton>
  );
}

