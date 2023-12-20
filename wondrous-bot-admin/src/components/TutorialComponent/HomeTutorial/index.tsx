import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTour } from "@reactour/tour";
import { useMe, withAuth } from "components/Auth";
import Modal from "components/Shared/Modal";
import { useEffect, useState } from "react";
import { TUTORIALS } from "utils/constants";
import { useUserCompletedGuides } from "utils/hooks";
import ModalComponent from "../ModalComponent";
import { ModalLabel, ModalTextBody } from "../styles";

const steps: any = [
  {
    // selector: "[data-tour=home-page-guide]",
    selector: "[data-tour=sidebar-quest-item]",
    content: () => <div>yo</div>,
    nextButtonTitle: null,
    prevButtonTitle: null,
    prevAction: null,
    position: [220, 180],
    disableInteraction: true,
    action: (node) => {
      node.style.boxShadow = "0px 4px 14px 0px rgba(0, 0, 0, 0.15)";
      node.style.borderRadius = "6px";
    },
    actionAfter: (node) => {
      node.style.boxShadow = "unset";
    },
    highlightedSelectors: ["[data-tour=home-page-guide]"],
  },
];

const useHomeTutorial = ({ hasConnectedBot = false }) => {
  const { setIsOpen, isOpen, setSteps } = useTour();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  const { user } = useMe() || {};
  const completedQuestGuides = user?.completedQuestGuides;

  useEffect(() => {
    if (hasConnectedBot && !isOpen) {
      setSteps(steps);
      setIsOpen(true);
    }
  }, []);
};

const HomeTutorial = () => {
  // const completedGuides = useUserCompletedGuides();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const completedGuides = [];

  const { setIsOpen, isOpen, setSteps } = useTour();

  useEffect(() => {
    if (completedGuides && !completedGuides?.includes(TUTORIALS.COMMUNITIES_HOME_GUIDE)) {
      setIsModalOpen(true);
    }
  }, []);

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleStart = () => {
    setSteps(steps);
    setIsModalOpen(false);
    setIsOpen(true);
  };

  const handleSkip = () => {};
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
