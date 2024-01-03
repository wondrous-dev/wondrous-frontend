import { useTour } from "@reactour/tour";
import { useContext, useEffect, useRef } from "react";
import { TUTORIALS } from "utils/constants";
import { TourDataContext } from "utils/context";
import ContentComponent from "../ContentComponent";
import { doArrow } from "../utils";
import { toggleHtmlOverflow } from "utils/common";
import { useMediaQuery } from "@mui/material";

const guide = TUTORIALS.COMMUNITIES_QUEST;

const useCreateQuestTutorial = ({ shouldDisplay }) => {
  const { setIsOpen, setSteps, setCurrentStep, currentStep } = useTour();

  const nodes = useRef([]);

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const steps: any = [
    {
      selector: "[data-tour=quests-page-template-modal]",
      position: [400, 740],
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
      action: (node) => {
        const closeButton = node?.querySelector("[data-tour=quests-page-template-modal-close-button]");
        const selectedElement = node?.querySelectorAll("[data-tour=quests-page-template-modal-quest-template]");
        // the DOM is changed after the next step appears in spotlight, this allows us to access the node element inside the next step
        const goToNextStep = () => {
          setIsOpen(false);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setTimeout(() => {
            setCurrentStep(1);
            setIsOpen(true);
          }, 500);
        };
        closeButton?.addEventListener("click", goToNextStep);
        nodes.current.push({
          element: node,
          event: "click",
          action: goToNextStep,
        });

        selectedElement?.forEach((element) => {
          element.addEventListener("click", goToNextStep);
          nodes.current.push({
            element,
            event: "click",
            action: goToNextStep,
          });
        });
      },
      hideButtons: true,
    },
    {
      selector: "[data-tour=tutorial-quest-title]",
      position: "right",
      // prevButtonTitle: "Exit tour",
      // prevAction: "skip",
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
      action: (node, ...args) => {
        nodes.current.forEach(({ element, event, action }) => {
          element.removeEventListener(event, action);
        });
        const questSettingsParent = node?.closest("[data-tour=tutorial-quest-settings]");
        if (questSettingsParent) {
          questSettingsParent.style.zIndex = 3;
        }
      },
    },
    {
      selector: "[data-tour=tutorial-activate-quest]",
      position: isMobile ? "bottom" : "right",
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
      content: () => (
        <ContentComponent
          content="Advanced options"
          subHeader="Open this panel up for advanced options. If you want to learn more about a feature, just hover over the ⓘ."
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
        node.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        const questSettingsParent = node?.closest("[data-tour=tutorial-quest-settings]");
        if (questSettingsParent) {
          questSettingsParent.style.zIndex = 3;
        }
      },
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
      // highlightedSelectors: [".tour-default-modal"],
      // mutationObservables: [".tour-default-modal"],
      // resizeObservables: [".tour-default-modal"],
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
      position: "bottom",
      mutationObservables: [".tour-default-modal", ".tutorials-quest-reward-modal"],
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
  ];

  const completedGuides = [];
  const { setCurrentId } = useContext(TourDataContext);
  useEffect(() => {
    if (completedGuides && !completedGuides?.includes(guide) && shouldDisplay) {
      setCurrentId(guide);
      setSteps(steps);
      setCurrentStep(0);
      setIsOpen(true);
    }
    return () => {
      setCurrentId(null);
      nodes.current.forEach(({ element, event, action }) => {
        element.removeEventListener(event, action);
      });
    };
  }, []);

  return null;
};

export default useCreateQuestTutorial;
