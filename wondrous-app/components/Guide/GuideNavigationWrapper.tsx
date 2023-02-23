import { useRouter } from 'next/router';
import { useMe } from 'components/Auth/withAuth';
import { NavigationWrapper } from './styles';
import { guideConfig } from './guide';

export const filterGuideSteps = ({ steps, user, router }) => {
  const onProjectHome = router.pathname === '/organization/[username]/home' || router.pathname === '/pod/[podId]/home';
  if (user?.lastCompletedGuide && onProjectHome) {
    return steps.slice(1);
  }
  return steps;
};

function GuideNextButton({ nextButton, prevButton, currentStep, setIsOpen, setCurrentStep }) {
  const router = useRouter();
  const user = useMe();
  const guide: any = guideConfig[router.pathname];
  const steps = filterGuideSteps({ steps: guide?.steps, user, router });

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
