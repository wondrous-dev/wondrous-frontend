import { useRouter } from 'next/router';
import { useMe } from 'components/Auth/withAuth';
import { NextButton, LaunchButton, LaunchButtonText } from './styles';
import { guideConfig } from './guide';
import { filterGuideSteps } from './GuideNavigationWrapper';

function GuideNextButton({
  currentStep,
  stepsLength,
  setIsOpen,
  setCurrentStep,
  setUserCompletedGuide,
  setProjectGuideComplete,
}) {
  const router = useRouter();
  const onProjectHome = router.pathname === '/organization/[username]/home' || router.pathname === '/pod/[podId]/home';
  const guide: any = guideConfig[router.pathname];
  const user = useMe();
  const steps = filterGuideSteps({ steps: guide?.steps, user, router });
  const stepsData = steps[currentStep];
  const buttonTitle = stepsData?.nextButtonTitle || 'Next';
  const action = async () => {
    if (stepsData.nextAction === 'finish' && onProjectHome) {
      if (guide?.id) {
        await setProjectGuideComplete({
          variables: {
            guideId: guide?.id,
          },
        });
      }
    }
    if (currentStep === steps.length - 1) {
      return setIsOpen(false);
    }
    return setCurrentStep((step) => step + 1);
  };
  if (stepsData?.nextAction === 'skip') {
    return null;
  }
  if (stepsData.nextAction === 'finish' && !onProjectHome) {
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
