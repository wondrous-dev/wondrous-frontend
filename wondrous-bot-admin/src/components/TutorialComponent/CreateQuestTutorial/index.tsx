import { useTour } from "@reactour/tour";
import { useContext, useEffect, useRef } from "react";
import { TUTORIALS } from "utils/constants";
import { TourDataContext } from "utils/context";
import ContentComponent from "../ContentComponent";
import { doArrow } from "../utils";
import { toggleHtmlOverflow } from "utils/common";

const guide = TUTORIALS.COMMUNITIES_QUEST;

const useCreateQuestTutorial = () => {
  const { setIsOpen, setSteps, setCurrentStep, currentStep } = useTour();

  const nodes = useRef([]);

  const handleNextStep = () => setCurrentStep((prev) => prev + 1);

  const steps: any = [
    {
      selector: '[data-tour="quests-page-template-modal"]',
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
        if (!node) return;
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
  ];

  console.log(currentStep);
  const completedGuides = [];
  const { setCurrentId } = useContext(TourDataContext);
  useEffect(() => {
    if (completedGuides && !completedGuides?.includes(guide)) {
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
