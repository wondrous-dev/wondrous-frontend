import { TourProvider } from "@reactour/tour";
import { useMutation } from "@apollo/client";
import { SET_USER_COMPLETED_GUIDE } from "graphql/mutations/user";
import { useMe } from "components/Auth";

import { useLocation } from "react-router-dom";
import { toggleHtmlOverflow } from "utils/common";
import { GET_LOGGED_IN_USER } from "graphql/queries";
import NavigationWrapper from "./NavigationWrapper";
import { NextNavigationButton, PrevNavigationButton } from "./NavigationButtons";
import { getStepsConfig } from "./utils";
import { HEADER_HEIGHT } from "utils/constants";

const TutorialComponent = ({ children }) => {
  const { user } = useMe() || {};
  const completedQuestGuides = user?.completedQuestGuides;
  const location = useLocation();

  const { steps, id, disableInteraction } = getStepsConfig(location.pathname);

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
    maskArea: (base, {x, y, width, height}) => {
      return { ...base, rx: 0, width: width - 19, zIndex: 999999 };
    },
    navigation: (base) => ({
      ...base,
      width: 0,
      counterReset: null,
    }),
    maskRect: (base, { x, y, width, height }) => ({
      ...base,
      width: '100%'
    }),
    maskWrapper: (base, {x, y, width, height}) => ({
      ...base,
      width: 500,
      color: "rgba(175, 158, 255, 1)",
    }),
  };

  const shakePopoverAnimation = () => {
    const popover = document.querySelector(".reactour__popover");
    if (popover) {
      popover.classList.add("shake-animation");
      setTimeout(() => {
        popover.classList.remove("shake-animation");
      }, 1000);
    }
  };

  return (
    <TourProvider
      steps={steps}
      afterOpen={disableBody}
      beforeClose={beforeClose}
      styles={styles}
      showCloseButton
      onClickMask={shakePopoverAnimation}
      disableInteraction={disableInteraction}
      disableDotsNavigation
      padding={{ popover: 15 }}
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
      nextButton={({ currentStep, setIsOpen, setCurrentStep }) => (
        <NextNavigationButton currentStep={currentStep} setIsOpen={setIsOpen} setCurrentStep={setCurrentStep} />
      )}
      prevButton={({ currentStep, setIsOpen, setCurrentStep }) => (
        <PrevNavigationButton currentStep={currentStep} setIsOpen={setIsOpen} setCurrentStep={setCurrentStep} />
      )}
    >
      {children}
    </TourProvider>
  );
};

export default TutorialComponent;
