import { useRouter } from 'next/router';
import { NextButton, LaunchButton, LaunchButtonText } from './styles';
import { guideConfig } from './guide';

function GuideNextButton({ currentStep, stepsLength, setIsOpen, setCurrentStep, setUserCompletedGuide }) {
  const router = useRouter();

  const guide: any = guideConfig[router.pathname];
  const steps = guide?.steps;

  const stepsData = steps[currentStep];
  const buttonTitle = stepsData?.nextButtonTitle || 'Next';
  const action = () => {
    if (currentStep === steps.length - 1) {
      return setIsOpen(false);
    }
    return setCurrentStep((step) => step + 1);
  };
  if (stepsData?.nextAction === 'skip') {
    return null;
  }
  if (stepsData.nextAction === 'finish') {
    return (
      <LaunchButton
        onClick={async () => {
          if (guide?.id) {
            await setUserCompletedGuide({
              variables: {
                guideId: guide?.id,
              },
            });
          }
          router.push('/onboarding-dao', undefined, {
            shallow: true,
          });
        }}
      >
        <LaunchButtonText>Launch a Project</LaunchButtonText>
      </LaunchButton>
    );
  }
  return (
    <NextButton type="button" onClick={action}>
      {buttonTitle}
    </NextButton>
  );
}

export default GuideNextButton;
