import { useRouter } from 'next/router';
import { useMe } from 'components/Auth/withAuth';
import { PrevButton, LaunchButton, LaunchButtonText } from './styles';
import { guideConfig } from './guide';
import { filterGuideSteps } from './GuideNavigationWrapper';

function GuidePrevButton({
  currentStep,
  stepsLength,
  setIsOpen,
  setCurrentStep,
  setUserCompletedGuide,
  setProjectCompletedGuide,
}) {
  const router = useRouter();
  const user = useMe();
  const onProjectHome = router.pathname === '/organization/[username]/home' || router.pathname === '/pod/[podId]/home';
  const guide: any = guideConfig[router.pathname];
  const steps = filterGuideSteps({ steps: guide?.steps, user, router });

  const stepsData = steps[currentStep];
  const buttonTitle = stepsData?.prevButtonTitle || 'Next';
  const action = () => {
    if (onProjectHome) {
      if (guide?.id) {
        setProjectCompletedGuide({
          variables: {
            guideId: guide?.id,
          },
        });
      }
    } else if (stepsData.nextAction !== 'finish') {
      if (guide?.id) {
        setUserCompletedGuide({
          variables: {
            guideId: guide?.id,
          },
        });
      }
    }
    if (currentStep === 0 || stepsData.prevAction === 'skip') {
      return setIsOpen(false);
    }
    return setCurrentStep((step) => step - 1);
  };
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
          router.push('/explore', undefined, {
            shallow: true,
          });
        }}
      >
        <LaunchButtonText>Find a project</LaunchButtonText>
      </LaunchButton>
    );
  }
  return (
    <PrevButton type="button" onClick={action}>
      {buttonTitle}
    </PrevButton>
  );
}

export default GuidePrevButton;
