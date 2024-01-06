import { useState, useEffect, useRef, useContext } from "react";
import { TUTORIALS } from "utils/constants";
import { useModalState } from "../shared";
import ModalComponent from "../ModalComponent";
import { useTour } from "@reactour/tour";
import { Box } from "@mui/material";
import { ModalLabel, ModalTextBody } from "../styles";
import ContentComponent from "../ContentComponent";
import { TourDataContext } from "utils/context";

const QuestsTutorial = () => {
  const { handleTourVisit } = useContext(TourDataContext);
  const { setIsOpen, isOpen, setSteps, currentStep, setCurrentStep } = useTour();

  const STEPS = [
    {
      selector: "[data-tour=quests-page-guide-new-quest-button]",
      content: () => (
        <ContentComponent
          content="Create a quest by clicking here!"
          wrapperProps={{
            sx: {
              width: "100%",
            },
          }}
        />
      ),
      hideButtons: true,
    },
  ];

  const { isModalOpen, setIsModalOpen } = useModalState({ guide: TUTORIALS.COMMUNITIES_QUESTS_PAGE_GUIDE });
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleStart = () => {
    setSteps(STEPS);
    setIsModalOpen(false);
    setIsOpen(true);
    handleTourVisit(TUTORIALS.COMMUNITIES_QUESTS_PAGE_GUIDE);
  };

  const handleSkip = () => handleTourVisit(TUTORIALS.COMMUNITIES_QUESTS_PAGE_GUIDE);

  useEffect(() => {
    return () => {
      setIsOpen(false);
      setCurrentStep(0);
      setSteps([]);
    };
  }, []);

  //TODO: replace image with higher quality - ask Ben
  return (
    <ModalComponent
      isModalOpen={isModalOpen}
      onClose={handleModalClose}
      imgSrc={"/images/tour-images/quests-page.png"}
      onStart={handleStart}
      onSkip={handleSkip}
    >
      <Box display="flex" flexDirection="column" gap="8px">
        <ModalLabel>Introducing Quests</ModalLabel>
        <ModalTextBody>Quests are fun challenges that your members complete to earn rewards.</ModalTextBody>
        <ModalTextBody>
          For more info check <a href="#">out this video.</a>
        </ModalTextBody>
      </Box>
    </ModalComponent>
  );
};

export default QuestsTutorial;
