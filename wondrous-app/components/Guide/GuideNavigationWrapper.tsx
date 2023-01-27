import { useRouter } from 'next/router';
import { NavigationWrapper } from './styles';
import { guideConfig } from './guide';

function GuideNextButton({ nextButton, prevButton, currentStep, setIsOpen, setCurrentStep }) {
  const router = useRouter();

  const guide: any = guideConfig[router.pathname];
  const steps = guide?.steps;

  const NextBtn: any = nextButton;
  const PrevBtn: any = prevButton;
  const currentStepConfig = steps[currentStep];
  const hideButtons = currentStepConfig?.hideButtons;
  const EndButton = currentStepConfig?.endButton;
  return (
    <NavigationWrapper>
      {(!hideButtons || !EndButton) && (
        <>
          <PrevBtn currentStep={currentStep} setIsOpen={setIsOpen} setCurrentStep={setCurrentStep} />
          <NextBtn currentStep={currentStep} setIsOpen={setIsOpen} setCurrentStep={setCurrentStep} />
        </>
      )}
      {EndButton ? <EndButton onClick={() => setIsOpen(false)} /> : null}
    </NavigationWrapper>
  );
}

export default GuideNextButton;
