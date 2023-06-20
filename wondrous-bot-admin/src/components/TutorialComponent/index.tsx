import { TourProvider } from "@reactour/tour";
import { useMutation } from "@apollo/client";
import { SET_USER_COMPLETED_GUIDE, SET_PROJECT_GUIDE_COMPLETE } from "graphql/mutations/user";
import { useMe, withAuth } from "components/Auth";
import { config } from "./config";
import { useLocation } from "react-router-dom";
import { toggleHtmlOverflow } from "utils/common";
import { GET_LOGGED_IN_USER } from "graphql/queries";
import NavigationWrapper from "./NavigationWrapper";
import { NextNavigationButton, PrevNavigationButton } from "./NavigationButtons";
import { getStepsConfig } from "./utils";

const TutorialComponent = ({ children }) => {
  const { user } = useMe() || {};
  const completedQuestGuides = user?.completedQuestGuides;
  const location = useLocation();


  const {steps, id, disableInteraction} = getStepsConfig(location.pathname);

  const [setUserCompletedGuide] = useMutation(SET_USER_COMPLETED_GUIDE, {
    refetchQueries: [{ query: GET_LOGGED_IN_USER }],
  });

  const disableBody = () => {
    toggleHtmlOverflow();
  };
  const beforeClose = () => {
    toggleHtmlOverflow();
    if (id && !completedQuestGuides?.includes(id)) {
      setUserCompletedGuide({
        variables: {
          guideId: id,
        },
      });
    }
  };

  const styles = {
    close: (base) => ({ ...base }),
    popover: (base) => ({
      ...base,
      borderRadius: "16px",
      background: "white",
      padding: "0px",
      overflow: "hidden",
      border: "0.5px solid rgba(75, 75, 75, 1)",
    }),
    maskArea: (base) => ({ ...base, rx: 10 }),
    navigation: (base) => ({
      ...base,
      counterReset: null,
    }),
    maskWrapper: (base) => ({
      ...base,
      color: "rgba(175, 158, 255, 0.9)",
    }),
  };

  return (
    <TourProvider
      steps={steps}
      afterOpen={disableBody}
      beforeClose={beforeClose}
      styles={styles}
      showCloseButton
      onClickMask={(e) => {}}
      disableInteraction={disableInteraction}
      disableDotsNavigation
      components={{
        Badge: () => null,
        Navigation: ({ nextButton, prevButton, currentStep, setIsOpen, setCurrentStep }) => (
          <NavigationWrapper
            nextButton={nextButton}
            prevButton={prevButton}
            currentStep={currentStep}
            setIsOpen={setIsOpen}
            setCurrentStep={setCurrentStep}
          />
        ),
      }}
      nextButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep }) => (
        <NextNavigationButton currentStep={currentStep} setIsOpen={setIsOpen} setCurrentStep={setCurrentStep} />
      )}
      prevButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep }) => (
        <PrevNavigationButton currentStep={currentStep} setIsOpen={setIsOpen} setCurrentStep={setCurrentStep} />
      )}
    >
      {children}
    </TourProvider>
  );
};

export default TutorialComponent;
