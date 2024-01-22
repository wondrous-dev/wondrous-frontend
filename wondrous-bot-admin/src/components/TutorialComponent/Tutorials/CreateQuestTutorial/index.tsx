import { useTour } from "@reactour/tour";
import { useContext, useEffect, useMemo, useRef } from "react";
import { TUTORIALS } from "utils/constants";
import { TourDataContext } from "utils/context";
import ContentComponent from "../../ContentComponent";
import { doArrow } from "../../utils";
import { useUserCompletedGuides } from "utils/hooks";
import { useParams } from "react-router-dom";

const guide = TUTORIALS.COMMUNITIES_QUEST;

const getTemplateModalPosition = () => {
  const element = document.querySelector("[data-tour=quests-page-template-modal]");
  const x = element?.getBoundingClientRect().x;
  const y = element?.getBoundingClientRect().y;
  return { x, y };
};

const useCreateQuestTutorial = ({ shouldDisplay }) => {
  const { setIsOpen, setSteps, setCurrentStep } = useTour();
  
  const { handleTourVisit, shouldForceOpenTour, setShouldForceOpenTour } = useContext(TourDataContext);
  const nodes = useRef([]);

  const initShouldOpenTour = useRef(shouldForceOpenTour);
  const { x, y } = useMemo(() => getTemplateModalPosition(), []);

  const getQuestStep = () => !!document.querySelector("[data-tour=tour-quest-step");

  const steps: any = [
    {
      selector: "[data-tour=quests-page-template-modal]",
      position: [x + 100, y + 620],
      afterAction: () => {
        if (shouldForceOpenTour) setShouldForceOpenTour(false);
      },
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: "white",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            "--rtp-arrow-left": "50px !important",
            ...doArrow(state.position, "left", "right", "white", "bottom"),
          };
        },
      },
      content: () => (
        <ContentComponent
          content="Select a quest from our library of templates."
          wrapperProps={{
            sx: {
              width: "282px",
            },
          }}
        />
      ),
      hideButtons: true,
    },
    {
      selector: "[data-tour=tutorial-quest-title]",
      position: "right",
      content: () => (
        <ContentComponent
          content="Update quest settings"
          subHeader="Update the title and add a description. You can also set level requirements, if each quest submission needs a review, and set the quest to active or inactive."
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
      action: (node) => {
        //we need to wait for the node to mount
        setTimeout(() => {
          const questSettingsParent = document?.querySelector("[data-tour=tutorial-quest-settings]") as HTMLElement;
          if (questSettingsParent) {
            questSettingsParent.style.zIndex = "3";
          }
        }, 200);
      },
    },
    {
      selector: "[data-tour=tutorial-activate-quest]",
      position: "right",
      action: (node) => {
        const questSettingsParent = node?.closest("[data-tour=tutorial-quest-settings]");
        if (questSettingsParent) {
          questSettingsParent.style.zIndex = 3;
        }
      },
      content: () => (
        <ContentComponent
          content="Do you want to make this quest visible to your community?"
          subHeader="If you toggle this on, once saved this quest will be visible to your community. You can also wait and activate it later."
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
      selector: "[data-tour=tutorial-show-extra]",
      position: "right",
      mutationObservables: ["[data-tour=tutorial-show-extra]"],
      resizeObservables: ["[data-tour=tutorial-show-extra]"],
      disableInteraction: true,
      content: () => (
        <ContentComponent
          content="Advanced options"
          subHeader="Open this panel up for advanced options. If you want to learn more about a feature, just hover over the ⓘ"
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
      afterAction: (node) => {
        const questSettingsParent = node?.closest("[data-tour=tutorial-quest-settings]");
        if (questSettingsParent) {
          questSettingsParent.style.zIndex = "unset";
        }
      },
    },
    {
      selector: "[data-tour=tutorial-quest-rewards]",
      position: "right",
      id: "tutorial-quest-rewards",
      action: () => {
        const questSettingsParent = document?.querySelector("[data-tour=tutorial-quest-settings]") as HTMLElement;
        if (questSettingsParent) {
          questSettingsParent.style.zIndex = "unset";
        }
      },
      disableInteraction: true,
      content: () => (
        <ContentComponent
          content="Add rewards for completions"
          subHeader="Give rewards for completing the quest. For example, type 10 to give out 10 points. Set advanced rewards like NFTs, Discord Roles, and tokens by clicking “Add New Reward.”"
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
      selector: ".tutorials-quest-reward-modal",
      id: "tutorial-add-rewards",
      highlightedSelectors: [".tutorials-quest-reward-modal"],
      mutationObservables: [".tour-default-modal", ".tutorials-quest-reward-modal"],
      disableInteraction: true,
      handleNextAction: () => {
        //TODO: move the logic to the useDynamicSteps hook
        const hasQuestStep = getQuestStep();
        if (!hasQuestStep) {
          return setCurrentStep((prev) => prev + 2);
        }
        return setCurrentStep((prev) => prev + 1);
      },
      content: () => (
        <ContentComponent
          content="Add rewards for completions"
          subHeader="Give rewards for completing the quest. For example, type 10 to give out 10 points. Set advanced rewards like NFTs, Discord Roles, and tokens by clicking “Add New Reward.”"
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
      selector: "[data-tour=tour-quest-step]",
      mutationObservables: ["[data-tour=tour-quest-step]"],
      resizeObservables: ["[data-tour=tour-quest-step]"],
      position: "left",
      action: (node) => {
        if (!node) return setCurrentStep((prev) => prev + 1);
      },
      content: (
        <ContentComponent
          content="Quest steps"
          subHeader="Quest steps are how you design the actions your members take. Fill out any relevant information for this quest step."
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
      selector: "[data-tour=tutorial-add-quest-step]",
      position: "left",
      hideButtons: true,
      content: <ContentComponent content="Click here to add a new quest step" />,
    },
    {
      selector: "[data-tour=tour-quest-step]",
      mutationObservables: ["[data-tour=tour-quest-step]"],
      resizeObservables: ["[data-tour=tour-quest-step]"],
      position: "left",
      content: (
        <ContentComponent
          content="Quest steps"
          subHeader="Quest steps are how you design the actions your members take."
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
      selector: "[data-tour=tour-quest-step]",
      position: "left",
      mutationObservables: ["[data-tour=tour-quest-step]"],
      resizeObservables: ["[data-tour=tour-quest-step]"],
      content: (
        <ContentComponent
          content="Click on the dropdown to change the quest step type"
          subHeader="There are 20 different types of quest steps - pick one and let’s customize it! Press Next when ready"
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
      selector: "[data-tour=tour-quest-step]",
      position: "left",
      id: "tour-selected-step",
      mutationObservables: ["[data-tour=tour-quest-step]"],
      resizeObservables: ["[data-tour=tour-quest-step]"],
      content: (
        <ContentComponent
          content="Nice choice!"
          subHeader="Customize of the quest step and let’s test your new quest!"
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
      afterAction: () => {
        if(initShouldOpenTour.current) {
          setShouldForceOpenTour(true);
        }
      },
      hideButtons: true,
      selector: "[data-tour=tour-save-quest]",
      position: "left",
      content: <ContentComponent content="Finish setting up your quest by clicking here" />,
    },
  ];

  const completedGuides = useUserCompletedGuides();

  useEffect(() => {
    if (shouldForceOpenTour) {
      handleTourVisit(TUTORIALS.COMMUNITIES_QUEST);
      const stepsClone = [...steps];
      if (!shouldDisplay) {
        stepsClone.shift();
      }
      setSteps(stepsClone);
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, [shouldForceOpenTour]);

  useEffect(() => {
    if (completedGuides && !completedGuides?.includes(guide) && shouldDisplay) {
      handleTourVisit(TUTORIALS.COMMUNITIES_QUEST);
      setSteps(steps);
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      nodes.current.forEach(({ element, event, action }) => {
        element.removeEventListener(event, action);
      });
      nodes.current = [];
    };
  }, []);

  return null;
};

export default useCreateQuestTutorial;
