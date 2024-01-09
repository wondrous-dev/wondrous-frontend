import { useEffect, useRef } from "react";
import ContentComponent from "../../ContentComponent";
import { Box, Typography } from "@mui/material";
import { useTour } from "@reactour/tour";
import { useUserCompletedGuides } from "utils/hooks";
import { TUTORIALS } from "utils/constants";

const useCreateReferralTutorial = () => {
  const nodes = useRef([]);
  const styledNodes = useRef([]);
  const completedGuides = useUserCompletedGuides();
  const { setIsOpen, isOpen, setSteps, currentStep, setCurrentStep } = useTour();

  const getIfActionSelected = () => document.querySelector("[data-tour=tutorial-entity-selector]");

  const steps: any = [
    {
      selector: "[data-tour=tutorial-referral-description]",
      position: "right",
      // prevButtonTitle: "Exit tour",
      // prevAction: "skip",
      content: () => (
        <ContentComponent
          content="Start by filling out the settings"
          //   subHeader="Set a title and description. This is what your members will see so make it descriptive. E.g. “Refer and earn!”"
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
        >
          <Box display="flex" flexDirection="column" gap="8px">
            <Typography
              color="black"
              fontFamily="Poppins"
              fontSize="15px"
              fontWeight={500}
              lineHeight="28px"
              maxWidth="85%"
            >
              Set a title and description. This is what your members will see so make it descriptive. E.g. “Refer and
              earn!”
            </Typography>
            <Typography
              color="black"
              fontFamily="Poppins"
              fontSize="15px"
              fontWeight={500}
              lineHeight="28px"
              maxWidth="85%"
            >
              You can also configure what level a member has to be to be eligible for this program and if you want a
              manual review before granting the rewards.{" "}
            </Typography>
          </Box>
        </ContentComponent>
      ),
      action: (node, ...args) => {
        const questSettingsParent = node?.closest("[data-tour=tutorial-referral-settings]");
        if (questSettingsParent) {
          styledNodes.current.push({
            element: questSettingsParent,
            action: () => {
              questSettingsParent.style.zIndex = 1;
            },
          });
          questSettingsParent.style.zIndex = 3;
        }
      },
    },
    {
      selector: "[data-tour=tutorial-referral-qualifying-action]",
      action: (node) => {
        styledNodes.current.forEach((el) => el?.action?.());
        node.style.zIndex = 3;
      },
      position: "left",
      handleNextAction: () => {
        const hasActionSelected = getIfActionSelected();
        if (hasActionSelected) {
          return setCurrentStep((prev) => prev + 1);
        }
        return setCurrentStep((prev) => prev + 2);
      },
      content: () => (
        <ContentComponent
          content="Select qualifying action"
          subHeader="Select whether you want the referral to be on the completion of a quest or the purchase of a product. If you haven’t launch your store we recommend starting with a quest."
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
      selector: "[data-tour=tutorial-entity-selector]",
      position: "left",
      content: () => (
        <ContentComponent
          content="Select eligible quests for this referral campaign"
          subHeader="Select which quests this referral program applies to."
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
      selector: "[data-tour=tutorial-referral-referrer-reward]",
      handlePrevAction: () => {
        const hasActionSelected = getIfActionSelected();
        if (hasActionSelected) {
          return setCurrentStep((prev) => prev - 1);
        }
        return setCurrentStep((prev) => prev - 2);
      },
      resizeObservables: ["[data-tour=tutorial-referral-referrer-reward"],
      mutationObservables: [
        "[data-tour=tutorial-referral-referrer-reward]",
        ".tour-default-modal",
        ".tutorials-quest-reward-modal",
      ],
      position: "left",
      highlightedSelectors: [".tutorials-quest-reward-modal"],
      action: (node) => {
        const qualifyingActionSelector = document.querySelector(
          "[data-tour=tutorial-referral-qualifying-action]"
        ) as HTMLElement;
        if (qualifyingActionSelector) {
          qualifyingActionSelector.style.zIndex = "unset";
        }
      },
      content: () => (
        <ContentComponent
          content="Set a reward for the advocate  (the one referring)"
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
      selector: "[data-tour=tutorial-referral-referred-reward]",
      resizeObservables: ["[data-tour=tutorial-referral-referred-reward"],
      mutationObservables: [
        "[data-tour=tutorial-referral-referred-reward]",
        ".tour-default-modal",
        ".tutorials-quest-reward-modal",
      ],
      highlightedSelectors: [".tutorials-quest-reward-modal"],
      position: "left",
      content: () => (
        <ContentComponent
          content="Set a reward for the friend (the one being referred)"
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
      selector: "[data-tour=tutorial-referral-media]",
      position: "left",
      // resizeObservables: ["data-tour=tutorial-referral-media"],
      // mutationObservables: ["data-tour=tutorial-referral-media"],
      content: () => (
        <ContentComponent
          content="Add the referral banner"
          subHeader="Add a banner image if you have one, if not you can use our default one here or proceed with none."
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
      selector: "[data-tour=tutorial-referral-save-button]",
      position: "bottom",
      hideButtons: true,
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
      content: () => <ContentComponent content="Alright, we’re ready to launch! 🚀" />,
    },
  ];

  useEffect(() => {
    if (!isOpen && !completedGuides.includes(TUTORIALS.REFERRAL_CREATE_PAGE_GUIDE)) {
      setSteps(steps);
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, []);
};

export default useCreateReferralTutorial;
