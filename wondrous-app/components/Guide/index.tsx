import { TourProvider } from '@reactour/tour';
import { useMutation } from '@apollo/client';
import { SET_USER_COMPLETED_GUIDE } from 'graphql/mutations/user';
import { guideConfig } from './guide';
import { useRouter } from 'next/router';
import { NextButton, PrevButton, NavigationWrapper } from './styles';
import { toggleHtmlOverflow } from 'utils/helpers';
export default function OnboardingGuide({ children }) {
  const [setUserCompletedGuide] = useMutation(SET_USER_COMPLETED_GUIDE);
  const router = useRouter();
  const guide = guideConfig[router?.pathname] || { steps: [], id: null };
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
    popover: (base) => {
      return {
        ...base,
        borderRadius: '6px',
        background: '#1D1D1D',
        padding: '35px',
        border: '0.5px solid rgba(75, 75, 75, 1)',
      };
    },
    navigation: (base) => {
      return {
        ...base,
        counterReset: null,
      };
    },
  };

  return (
    <TourProvider
      afterOpen={disableBody}
      beforeClose={beforeClose}
      showCloseButton={false}
      disableInteraction={true}
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
