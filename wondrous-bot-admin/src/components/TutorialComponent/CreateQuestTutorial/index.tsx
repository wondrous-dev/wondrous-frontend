import { useTour } from "@reactour/tour";
import { useContext, useEffect, useMemo, useRef } from "react";
import { TUTORIALS } from "utils/constants";
import { TourDataContext } from "utils/context";
import ContentComponent from "../ContentComponent";
import { doArrow } from "../utils";

const guide = TUTORIALS.COMMUNITIES_QUEST;

const getTemplateModalPosition = () => {
  const element = document.querySelector("[data-tour=quests-page-template-modal]");
  const x = element?.getBoundingClientRect().x;
  const y = element?.getBoundingClientRect().y;
  return { x, y };
};

const useCreateQuestTutorial = ({ shouldDisplay }) => {
  const { setIsOpen, setSteps, setCurrentStep, currentStep } = useTour();

  const nodes = useRef([]);

  const { x, y } = useMemo(() => getTemplateModalPosition(), []);

  const getQuestStep = () => !!document.querySelector("[data-tour=tour-quest-step");

  const steps: any = [
    {
      selector: "[data-tour=quests-page-template-modal]",
      position: [x + 100, y + 650],
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
        nodes.current = [];
        const questSettingsParent = node?.closest("[data-tour=tutorial-quest-settings]");
        if (questSettingsParent) {
          questSettingsParent.style.zIndex = 3;
        }
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
      action: (node) => {
        // node.scrollIntoView({
        //   behavior: "smooth",
        //   block: "center",
        // });
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
      mutationObservables: [".tour-default-modal", ".tutorials-quest-reward-modal"],
      disableInteraction: true,
      handleNextAction: () => {
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
      handlePrevAction: () => {
        setCurrentStep((prev) => prev - 2);
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
      handlePrevAction: () => {
        const hasQuestStep = getQuestStep();
        if (!hasQuestStep) {
          return setCurrentStep((prev) => prev - 3);
        }
        return setCurrentStep((prev) => prev - 2);
      },
      action: (node) => {
        // wait for state change to update the current step
        const handleStepChange = () => {
          setIsOpen(false);
          setTimeout(() => setCurrentStep((prev) => prev + 1), 500);
          setIsOpen(true);
        };
        node.addEventListener("click", handleStepChange);
        nodes.current.push({
          element: node,
          event: "click",
          action: handleStepChange,
        });
      },
      content: <ContentComponent content="Click here to add a new quest step" />,
    },
    {
      selector: "[data-tour=tour-quest-step]",
      mutationObservables: ["[data-tour=tour-quest-step]"],
      resizeObservables: ["[data-tour=tour-quest-step]"],
      position: "left",
      handlePrevAction: () => {
        setCurrentStep((prev) => prev - 2);
      },
      action: () => {
        nodes.current.forEach(({ element, event, action }) => {
          element.removeEventListener(event, action);
        });
        nodes.current = [];
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
      selector: "[data-tour=tour-quest-step]",
      position: "left",
      mutationObservables: ["[data-tour=tour-quest-step]"],
      resizeObservables: ["[data-tour=tour-quest-step]"],
      handlePrevAction: () => {
        setCurrentStep((prev) => prev - 2);
      },
      action: (node) => {
        nodes.current.forEach(({ element, event, action }) => {
          element.removeEventListener(event, action);
        });
        nodes.current = [];
        const onChange = () => setCurrentStep((prev) => prev + 1);
        const autocompleteElement = node.querySelector("[data-tour=tour-quest-step-type]")?.querySelector("input");
        autocompleteElement?.addEventListener("change", onChange);
        nodes.current.push({
          element: autocompleteElement,
          event: "change",
          action: onChange,
        });
      },
      content: (
        <ContentComponent
          content="Click on the dropdown to change the quest step type"
          subHeader="There are 20 different types of quest steps - pick one and let’s customize it!"
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
      handlePrevAction: () => {
        setCurrentStep((prev) => prev - 2);
      },
      action: () => {
        nodes.current.forEach(({ element, event, action }) => {
          element.removeEventListener(event, action);
        });
        nodes.current = [];
      },
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
      hideButtons: true,
      selector: "[data-tour=tour-save-quest]",
      position: "left",
      action: (node) => {
        const closeTour = () => {
          setIsOpen(false);
          setSteps([]);
          setCurrentStep(0);
        };
        node.addEventListener("click", closeTour);
        nodes.current.push({
          element: node,
          event: "click",
          action: closeTour,
        });
      },
      content: <ContentComponent content="Finish setting up your quest by clicking here" />,
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
      nodes.current = [];
    };
  }, []);

  return null;
};

export default useCreateQuestTutorial;
