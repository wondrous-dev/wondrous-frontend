import { TourProvider } from '@reactour/tour';
import { useMutation } from '@apollo/client';
import { SET_USER_COMPLETED_GUIDE, SET_PROJECT_GUIDE_COMPLETE } from 'graphql/mutations/user';
import { useRouter } from 'next/router';
import { toggleHtmlOverflow } from 'utils/helpers';
import { GET_LOGGED_IN_USER } from 'graphql/queries';
import GuideNextButton from 'components/Guide/GuideNextButton';
import GuidePrevButton from 'components/Guide/GuidePrevButton';
import GuideNavigationWrapper, { filterGuideSteps } from 'components/Guide/GuideNavigationWrapper';
import palette from 'theme/palette';
import { useMe } from 'components/Auth/withAuth';
import { guideConfig } from './guide';

export default function OnboardingGuide({ children }) {
  const [setUserCompletedGuide] = useMutation(SET_USER_COMPLETED_GUIDE, {
    refetchQueries: [{ query: GET_LOGGED_IN_USER }],
  });

  const [setProjectGuideComplete] = useMutation(SET_PROJECT_GUIDE_COMPLETE, {
    refetchQueries: [{ query: GET_LOGGED_IN_USER }],
  });

  const router = useRouter();
  const user = useMe();
  const guide: any = guideConfig[router.pathname];
  const onProjectHome = router.pathname === '/organization/[username]/home' || router.pathname === '/pod/[podId]/home';
  const steps = filterGuideSteps({ steps: guide?.steps, user, router });
  const disableBody = () => {
    toggleHtmlOverflow();
  };
  const beforeClose = () => {
    toggleHtmlOverflow();
    if (guide?.id) {
      if (onProjectHome) {
        setProjectGuideComplete();
      } else {
        setUserCompletedGuide({
          variables: {
            guideId: guide?.id,
          },
        });
      }
    }
  };

  const styles = {
    close: (base) => ({ ...base, color: palette.grey10 }),
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

  if (!user) return null;
  return (
    <TourProvider
      afterOpen={disableBody}
      beforeClose={beforeClose}
      showCloseButton
      disableInteraction
      onClickMask={() => {}}
      steps={steps}
      disableDotsNavigation
      styles={styles}
      components={{
        Badge: () => null,
        Navigation: ({ nextButton, prevButton, currentStep, setIsOpen, setCurrentStep }) => (
          <GuideNavigationWrapper
            nextButton={nextButton}
            prevButton={prevButton}
            currentStep={currentStep}
            setIsOpen={setIsOpen}
            setCurrentStep={setCurrentStep}
          />
        ),
      }}
      nextButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep }) => (
        <GuideNextButton
          currentStep={currentStep}
          stepsLength={stepsLength}
          setIsOpen={setIsOpen}
          setCurrentStep={setCurrentStep}
          setUserCompletedGuide={setUserCompletedGuide}
          setProjectGuideComplete={setProjectGuideComplete}
        />
      )}
      prevButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep }) => (
        <GuidePrevButton
          currentStep={currentStep}
          stepsLength={stepsLength}
          setIsOpen={setIsOpen}
          setCurrentStep={setCurrentStep}
          setUserCompletedGuide={setUserCompletedGuide}
          setProjectCompletedGuide={setProjectGuideComplete}
        />
      )}
    >
      {children}
    </TourProvider>
  );
}
