import { TourProvider } from '@reactour/tour';
import { useMutation } from '@apollo/client';
import { SET_USER_COMPLETED_GUIDE } from 'graphql/mutations/user';
import { useRouter } from 'next/router';
import { toggleHtmlOverflow } from 'utils/helpers';
import { GET_LOGGED_IN_USER } from 'graphql/queries';
import { NextButton, PrevButton, NavigationWrapper, LaunchButton, LaunchButtonText } from './styles';
import { guideConfig } from './guide';

export default function OnboardingGuide({ children }) {
  const [setUserCompletedGuide] = useMutation(SET_USER_COMPLETED_GUIDE, {
    refetchQueries: [{ query: GET_LOGGED_IN_USER }],
  });

  const router = useRouter();

  const guide: any = guideConfig[router.pathname];
  const steps = guide?.steps;
  const disableBody = () => {
    toggleHtmlOverflow();
  };
  const beforeClose = () => {
    toggleHtmlOverflow();
    if (guide?.id) {
      setUserCompletedGuide({
        variables: {
          guideId: guide?.id,
        },
      });
    }
  };

  const styles = {
    popover: (base) => ({
      ...base,
      borderRadius: '6px',
      background: '#1D1D1D',
      padding: '35px',
      border: '0.5px solid rgba(75, 75, 75, 1)',
    }),
    navigation: (base) => ({
      ...base,
      counterReset: null,
    }),
  };

  if (!guide?.id) return <>{children}</>;
  return (
    <TourProvider
      afterOpen={disableBody}
      beforeClose={beforeClose}
      showCloseButton={false}
      disableInteraction
      onClickMask={() => {}}
      steps={steps}
      disableDotsNavigation
      styles={styles}
      components={{
        Badge: () => null,
        Navigation: ({ nextButton, prevButton, currentStep, setIsOpen, setCurrentStep, ...props }) => {
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
        },
      }}
      nextButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep }) => {
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
              onClick={() => {
                if (guide?.id) {
                  setUserCompletedGuide({
                    variables: {
                      guideId: guide?.id,
                    },
                  }).then(() => {
                    router.push('/onboarding-dao', undefined, {
                      shallow: true,
                    });
                  });
                } else {
                  router.push('/onboarding-dao', undefined, {
                    shallow: true,
                  });
                }
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
      }}
      prevButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep }) => {
        const stepsData = steps[currentStep];
        const buttonTitle = stepsData?.prevButtonTitle || 'Next';
        const action = () => {
          if (currentStep === 0 || stepsData.prevAction === 'skip') {
            return setIsOpen(false);
          }
          return setCurrentStep((step) => step - 1);
        };
        if (stepsData.nextAction === 'finish') {
          return (
            <LaunchButton
              onClick={() => {
                if (guide?.id) {
                  setUserCompletedGuide({
                    variables: {
                      guideId: guide?.id,
                    },
                  }).then(() => {
                    router.push('/explore', undefined, {
                      shallow: true,
                    });
                  });
                } else {
                  router.push('/explore', undefined, {
                    shallow: true,
                  });
                }
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
      }}
    >
      {children}
    </TourProvider>
  );
}
