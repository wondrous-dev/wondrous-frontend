import { useContext, useEffect, useMemo, useRef, useState } from "react";
import ModalComponent from "../../ModalComponent";
import { Box, useMediaQuery } from "@mui/material";
import { TUTORIALS } from "utils/constants";
import { ModalLabel, ModalTextBody } from "../../styles";
import { useTour } from "@reactour/tour";
import { TourDataContext } from "utils/context";
import ContentComponent from "../../ContentComponent";
import { doArrow } from "../../utils";
import FinishModalComponent from "../shared/FinishModalComponent";
import { getNodePosition } from "utils/common";
import { useUserCompletedGuides } from "utils/hooks";

export const useLevelsRewardTutorial = (rewardType, setIsRewardModalOpen) => {
  const { isOpen, setCurrentStep, steps, currentStep, setSteps } = useTour();

  const initialRewardType = useMemo(() => rewardType, []);
  const currentStepConfig: any = useMemo(() => {
    return steps[currentStep];
  }, [currentStep, steps]);

  const handleRewardTypeChange = (rewardType) => {
    if (rewardType !== initialRewardType && currentStepConfig.id === "levels-modal-open") {
      const idx = steps.findIndex((step: any) => step.id === "levels-add-reward");
      setCurrentStep(idx);
    }
    if (rewardType !== initialRewardType && currentStepConfig.id === "levels-type-change") {
      setCurrentStep((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (currentStepConfig.id === "open-modal" && !currentStepConfig.handleNextAction && currentStepConfig) {
      const newCurrentStepConfig = {
        ...currentStepConfig,
        handleNextAction: () => {
          setIsRewardModalOpen(true);
          setCurrentStep((prev) => prev + 1);
        },
      };

      const newSteps: any = [...steps];
      newSteps[currentStep] = newCurrentStepConfig;
      const finalModalStepIdx = newSteps.findIndex((step: any) => step.id === "levels-add-reward");
      const finalModalStepConfig = newSteps[finalModalStepIdx];
      const finalModalStepConfigWithAction = {
        ...finalModalStepConfig,
        handleNextAction: () => {
          setIsRewardModalOpen(false);
          setCurrentStep((prev) => prev + 1);
        },
      };
      newSteps[finalModalStepIdx] = finalModalStepConfigWithAction;
      setSteps(newSteps);
    }
  }, [currentStepConfig, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    handleRewardTypeChange(rewardType);
  }, [isOpen, rewardType]);
  if (!isOpen) return;
};

const LevelsTutorial = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const { setIsOpen, setCurrentStep, currentStep, setSteps, meta, setMeta } = useTour();

  const { x, y } = useMemo(() => {
    return getNodePosition("[data-tour=tutorial-levels-table]");
  }, []);

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const steps: any = [
    {
      id: "open-modal",
      selector: "[data-tour=tutorial-levels-table-title]",
      highlightedSelectors: ["[data-tour=tutorial-levels-table-title]", "[data-tour=tutorial-levels-table]"],
      resizeObservables: ["[data-tour=tutorial-levels-table]"],
      mutationObservables: ["[data-tour=tutorial-levels-table]"],
      position: isMobile ? "top" : [x + 950, y + 100],
      ...(!isMobile
        ? {
            styles: {
              popover: (base, state) => {
                return {
                  ...base,
                  background: "white",
                  borderRadius: "16px",
                  padding: "0px",
                  zIndex: 1000000,
                  ...doArrow(state.position, state.verticalAlign, state.horizontalAlign, "white", "right"),
                };
              },
            },
          }
        : {}),
      content: () => (
        <ContentComponent
          content="Add level rewards"
          subHeader="Incentivize your members to progress to new levels! Here you can add rewards for when your members reach different levels."
          typographyProps={{
            textAlign: "left",
          }}
          wrapperProps={{
            sx: {
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: "100%",
            },
          }}
        />
      ),
    },
    {
      id: "levels-modal-open",
      position: isMobile ? [50, 50] : "left",
      selector: ".tutorials-quest-reward-modal",
      highlightedSelectors: [".tutorials-quest-reward-modal"],
      mutationObservables: [".tour-default-modal", ".tutorials-quest-reward-modal"],
      resizeObservables: [".tour-default-modal", ".tutorials-quest-reward-modal"],
      content: () => (
        <ContentComponent
          typographyProps={{
            color: isMobile ? "white" : "black",
          }}
          content="Here is how to add rewards."
        />
      ),
      ...(isMobile
        ? {
            prevButtonTypographyStyles: {
              color: "white",
            },
          }
        : {}),
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: isMobile ? "#2A8D5C" : "white",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            ...doArrow(
              state.position,
              state.verticalAlign,
              state.horizontalAlign,
              isMobile ? "#2A8D5C" : "white",
              "top",
              isMobile ? 120 : 20
            ),
          };
        },
      },
    },
    {
      position: isMobile ? [50, 50] : "left",
      id: "levels-type-change",
      selector: ".tutorials-quest-reward-modal",
      highlightedSelectors: [".tutorials-quest-reward-modal"],
      mutationObservables: [".tour-default-modal", ".tutorials-quest-reward-modal"],
      resizeObservables: [".tour-default-modal", ".tutorials-quest-reward-modal"],
      content: () => (
        <ContentComponent
          typographyProps={{
            color: isMobile ? "white" : "black",
          }}
          content="Select the reward type"
        />
      ),
      ...(isMobile
        ? {
            prevButtonTypographyStyles: {
              color: "white",
            },
          }
        : {}),
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: isMobile ? "#2A8D5C" : "white",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            ...doArrow(
              state.position,
              state.verticalAlign,
              state.horizontalAlign,
              isMobile ? "#2A8D5C" : "white",
              "top",
              isMobile ? 120 : 20
            ),
          };
        },
      },
    },

    {
      position: isMobile ? [50, 50] : "left",
      id: "levels-add-reward",
      selector: ".tutorials-quest-reward-modal",
      highlightedSelectors: [".tutorials-quest-reward-modal"],
      mutationObservables: [".tour-default-modal", ".tutorials-quest-reward-modal"],
      resizeObservables: [".tour-default-modal", ".tutorials-quest-reward-modal"],
      content: () => (
        <ContentComponent
          typographyProps={{
            color: isMobile ? "white" : "black",
          }}
          content="Add the reward information and press ‘Add Reward’!"
        />
      ),
      ...(isMobile
        ? {
            prevButtonTypographyStyles: {
              color: "white",
            },
          }
        : {}),
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: isMobile ? "#2A8D5C" : "white",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            ...doArrow(
              state.position,
              state.verticalAlign,
              state.horizontalAlign,
              isMobile ? "#2A8D5C" : "white",
              "top",
              isMobile ? 120 : 20
            ),
          };
        },
      },
    },
    {
      position: "left",
      id: "levels-modal-close-with-rewards",
      selector: "[data-tour=tutorial-levels-table-title]",
      highlightedSelectors: ["[data-tour=tutorial-levels-table-title]", "[data-tour=tutorial-levels-table]"],
      resizeObservables: ["[data-tour=tutorial-levels-table]"],
      mutationObservables: ["[data-tour=tutorial-levels-table]"],
      nextButtonTitle: "Next",
      alignCenter: true,
      hidePrevButton: true,
      content: () => (
        <ContentComponent
          content="You added your first reward!"
          subHeader="You can add rewards on every level to keep your community inspired to climb up the leaderboard."
        />
      ),
      handleNextAction: () => {
        setIsOpen(false);
        return setIsFinishModalOpen(true);
      },
    },
    {
      position: "left",
      id: "levels-modal-close",
      selector: "[data-tour=tutorial-levels-table-title]",
      highlightedSelectors: ["[data-tour=tutorial-levels-table-title]", "[data-tour=tutorial-levels-table]"],
      resizeObservables: ["[data-tour=tutorial-levels-table]"],
      mutationObservables: ["[data-tour=tutorial-levels-table]"],
      nextButtonTitle: "Next",
      alignCenter: true,
      hidePrevButton: true,
      handleNextAction: () => {
        setIsOpen(false);
        return setIsFinishModalOpen(true);
      },
      content: () => (
        <ContentComponent
          subHeader="You can add rewards on every level to keep your community inspired to climb up the leaderboard."
          content="Add the reward information and press ‘Add Reward’!"
        />
      ),
    },
  ];

  const completedGuides = useUserCompletedGuides();
  const { handleTourVisit, setShouldForceOpenTour, shouldForceOpenTour } = useContext(TourDataContext);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleStart = () => {
    setSteps(steps);
    setCurrentStep(0);
    setIsModalOpen(false);
    setIsOpen(true);
    handleTourVisit(TUTORIALS.LEVELS_PAGE_GUIDE);
  };
  const handleSkip = () => {
    handleTourVisit(TUTORIALS.LEVELS_PAGE_GUIDE);
  };

  const handleTourStart = () => {
    if (completedGuides && (!completedGuides?.includes(TUTORIALS.LEVELS_PAGE_GUIDE) || shouldForceOpenTour)) {
      setIsModalOpen(true);
      if (shouldForceOpenTour) {
        return setShouldForceOpenTour(false);
      }
    }
  };
  useEffect(() => {
    return () => {
      setIsOpen(false);
      setCurrentStep(0);
      setSteps([]);
    };
  }, []);

  useEffect(() => {
    handleTourStart();
  }, [shouldForceOpenTour]);

  return (
    <>
      {isFinishModalOpen ? (
        <FinishModalComponent
          onClose={() => setIsFinishModalOpen(false)}
          header={"Levels tour complete!"}
          imgBgColor={"#D5AEFD"}
          img={"/images/tour-images/levels-page.png"}
          subHeader={"Gamifying your community with levels will make it more fun and keep your community engaged."}
          bodyText={"To learn more about our other features, just select them on the sidebar and begin the tour."}
        />
      ) : null}

      <ModalComponent
        isModalOpen={isModalOpen}
        onClose={handleModalClose}
        imgSrc={"/images/tour-images/levels-page.png"}
        onStart={handleStart}
        onSkip={handleSkip}
      >
        <Box display="flex" flexDirection="column" gap="8px">
          <ModalLabel>Customize levels</ModalLabel>
          <ModalTextBody>
            Gamify your community with levels. Keep track of points and let your members compete to get to the top of
            the leaderboard.
          </ModalTextBody>
          <ModalTextBody>
            For more info check <a href="#">out this video.</a>
          </ModalTextBody>
        </Box>
      </ModalComponent>
    </>
  );
};

export default LevelsTutorial;
