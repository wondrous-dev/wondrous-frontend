import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTour } from "@reactour/tour";
import { useMe, withAuth } from "components/Auth";
import Modal from "components/Shared/Modal";
import { useContext, useEffect, useRef, useState } from "react";
import { TUTORIALS } from "utils/constants";
import { useGlobalContext, useUserCompletedGuides } from "utils/hooks";
import ModalComponent from "../../ModalComponent";
import { ModalLabel, ModalTextBody } from "../../styles";
import ContentComponent from "../../ContentComponent";
import { doArrow } from "../../utils";
import { TourDataContext } from "utils/context";

const desktopSelector = "[data-tour=sidebar-quest-item]";
const mobileSelector = "[data-tour=homepage-guide-menu]";

const desktopSteps: any = [
  {
    selector: desktopSelector,
    content: () => (
      <ContentComponent
        content="Let's get started by creating your first quest!"
        wrapperProps={{
          sx: {
            width: "282px",
          },
        }}
      />
    ),
    nextButtonTitle: null,
    prevButtonTitle: null,
    prevAction: null,
    hideButtons: true,
    position: "right",
    disableInteraction: true,
    action: (node) => {
      const parent = node.closest("[data-tour=sidebar-drawer]");
      const elementsToEnable = Array.from(parent?.getElementsByTagName("a") || [])
        ?.filter((anchorTag: HTMLAnchorElement) => anchorTag.getAttribute("data-tour") !== "sidebar-quest-item")
        ?.concat(Array.from(parent?.getElementsByTagName("button") || []));
      elementsToEnable?.forEach((htmlElement: HTMLAnchorElement | HTMLButtonElement) => {
        if (htmlElement.getAttribute("data-tour") !== "sidebar-quest-item") {
          htmlElement.style.pointerEvents = "none";
        }
      });
      parent.style.zIndex = 999999;
      node.style.boxShadow = "0px 4px 14px 0px rgba(0, 0, 0, 0.15)";
      node.style.borderRadius = "6px";
      node.zIndex = 1000000;
    },
    actionAfter: (node) => {
      const parent = node.closest("[data-tour=sidebar-drawer]");
      const elementsToEnable = Array.from(parent?.getElementsByTagName("a"))
        ?.filter((anchorTag: HTMLAnchorElement) => anchorTag.getAttribute("data-tour") !== "sidebar-quest-item")
        ?.concat(Array.from(parent?.getElementsByTagName("button")));
      elementsToEnable?.forEach((anchorTag: HTMLAnchorElement) => {
        if (anchorTag.getAttribute("data-tour") !== "sidebar-quest-item") {
          anchorTag.style.pointerEvents = "unset";
        }
      });
      node.style.boxShadow = "unset";
      parent.style.zIndex = 9999;
      node.zIndex = 1;
    },
  },
];

const HomeTutorial = () => {
  const completedGuides = useUserCompletedGuides();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setIsOpen, setSteps, setCurrentStep } = useTour();
  const { handleTourVisit, shouldForceOpenTour, setShouldForceOpenTour } = useContext(TourDataContext);

  const nodes = useRef([]);
  useEffect(() => {
    if ((completedGuides && !completedGuides.includes(TUTORIALS.COMMUNITIES_HOME_GUIDE)) || shouldForceOpenTour) {
      setIsModalOpen(true);
      setShouldForceOpenTour(false);
    }
  }, [shouldForceOpenTour, completedGuides]);

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  const handleMobileStep = () => {
    setCurrentStep((currentStep) => (currentStep === 1 ? 0 : 1));
  };

  const mobileQuestButtonAfterAction = (node) => {
    const parent = node.closest("[data-tour=header]");
    const elementsToEnable = Array.from(parent?.getElementsByTagName("a"))
      ?.concat(Array.from(parent?.getElementsByTagName("button")))
      ?.filter(
        (anchorTag: HTMLAnchorElement) =>
          !["sidebar-quest-item", "homepage-guide-menu"].includes(anchorTag.getAttribute("data-tour"))
      );
    elementsToEnable?.forEach((anchorTag: HTMLAnchorElement) => {
      anchorTag.style.pointerEvents = "unset";
    });
    node.style.borderRadius = "unset";
    node.style.border = "unset";
  };

  const handleMobileStepItemClick = (e) => {
    return mobileQuestButtonAfterAction(e.currentTarget);
  };

  const mobileSteps = [
    {
      selector: mobileSelector,
      position: [90, 100],
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: "white",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            ...doArrow(state.position, "right", "left", "white", "bottom"),
          };
        },
      },
      hideButtons: true,
      content: () => (
        <ContentComponent
          content="Let's get started by creating your first quest!"
          wrapperProps={{
            sx: {
              width: "282px",
            },
          }}
        />
      ),
      action: (node) => {
        node.addEventListener("click", handleMobileStep);
        nodes.current.push({
          element: node,
          event: "click",
          action: handleMobileStep,
        });
      },
    },
    {
      selector: "[data-tour=sidebar-quest-item]",
      hideButtons: true,
      action: (node) => {
        const parent = node.closest("[data-tour=header]");
        const elementsToDisable = Array.from(parent?.getElementsByTagName("a") || [])
          ?.concat(Array.from(parent?.getElementsByTagName("button")))
          ?.filter(
            (anchorTag: HTMLAnchorElement) =>
              !["sidebar-quest-item", "homepage-guide-menu"].includes(anchorTag.getAttribute("data-tour"))
          );
        elementsToDisable?.forEach((htmlElement: HTMLAnchorElement | HTMLButtonElement) => {
          htmlElement.style.pointerEvents = "none";
        });
        node.style.borderRadius = "6px";
        node.style.border = "1px dashed #AF9EFF";
        node.addEventListener("click", handleMobileStepItemClick);
        nodes.current.push({
          element: node,
          event: "click",
          action: handleMobileStepItemClick,
        });
      },
      position: [150, 250],
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: "#2A8D5C",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            ...doArrow(state.position, state.verticalAlign, state.horizontalAlign, "#2A8D5C", "bottom"),
          };
        },
      },
      afterAction: mobileQuestButtonAfterAction,
      content: () => (
        <ContentComponent
          typographyProps={{
            color: "white",
          }}
          content="Another one!"
          wrapperProps={{
            sx: {
              width: "160px",
            },
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    return () => {
      nodes.current?.forEach(({ element, event, action }) => {
        element.removeEventListener(event, action);
      });
      setCurrentStep(0);
      setSteps([]);
    };
  }, []);

  const steps = isMobile ? mobileSteps : desktopSteps;
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleStart = () => {
    setSteps(steps);
    setIsModalOpen(false);
    setIsOpen(true);
    handleTourVisit(TUTORIALS.COMMUNITIES_HOME_GUIDE);
  };

  const handleSkip = () => handleTourVisit(TUTORIALS.COMMUNITIES_HOME_GUIDE);

  return (
    <ModalComponent
      isModalOpen={isModalOpen}
      onClose={handleModalClose}
      imgSrc={"/images/tour-images/homepage.png"}
      onStart={handleStart}
      onSkip={handleSkip}
    >
      <Box display="flex" flexDirection="column" gap="8px">
        <ModalLabel>Welcome to Wonderverse!</ModalLabel>
        <ModalTextBody>
          I’m your community building co-pilot. Together, we’re going to help you design and build a vibrant community.
        </ModalTextBody>
      </Box>
    </ModalComponent>
  );
};

export default withAuth(HomeTutorial);
