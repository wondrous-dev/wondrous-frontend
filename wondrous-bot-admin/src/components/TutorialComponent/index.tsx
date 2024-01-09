import { TourProvider } from "@reactour/tour";

import { toggleHtmlOverflow } from "utils/common";
import NavigationWrapper from "./NavigationWrapper";
import { NextNavigationButton, PrevNavigationButton } from "./NavigationButtons";
import { doArrow } from "./utils";

const TutorialComponent = ({ children }) => {
  const toggleBodyScroll = () => {
    toggleHtmlOverflow();
  };

  const styles = {
    close: (base) => ({ ...base }),
    popover: (base, state) => {
      return {
        ...base,
        borderRadius: "16px",
        background: "white",
        padding: "0px",
        zIndex: 10000,
        ...doArrow(state.position, state.verticalAlign, state.horizontalAlign),
      };
    },
    navigation: (base) => ({
      ...base,
      width: 0,
      counterReset: null,
    }),
    maskArea: (base) => ({ ...base, rx: 24 }),
    maskWrapper: (base, { x, y, width, height }) => ({
      ...base,
      width: 500,
      zIndex: 2,
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
      steps={[]}
      afterOpen={toggleBodyScroll}
      beforeClose={toggleBodyScroll}
      maskClassName="mask"
      scrollSmooth
      styles={styles}
      showCloseButton={false}
      onClickMask={shakePopoverAnimation}
      disableDotsNavigation
      disableKeyboardNavigation
      padding={{ popover: 12, mask: 6 }}
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
