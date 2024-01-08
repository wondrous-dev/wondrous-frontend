import { useState, useEffect, useRef, useContext } from "react";
import { TUTORIALS } from "utils/constants";
import ModalComponent from "../ModalComponent";
import { useTour } from "@reactour/tour";
import { Box } from "@mui/material";
import { ModalLabel, ModalTextBody } from "../styles";
import ContentComponent from "../ContentComponent";
import { TourDataContext } from "utils/context";
import { useUserCompletedGuides } from "utils/hooks";
import { useLocation } from "react-router-dom";
import FinishModalComponent from "../shared/FinishModalComponent";

const QuestsTutorial = () => {
  // const completedGuides = [];
  const completedGuides = useUserCompletedGuides();
  const { handleTourVisit } = useContext(TourDataContext);
  const { setIsOpen, isOpen, setSteps, currentStep, setCurrentStep } = useTour();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { search } = useLocation();

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const searchParams = new URLSearchParams(search);

  const tourQuestId = searchParams.get("tourQuestId");

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

  const POST_QUEST_CREATE_STEPS: any = [
    {
      selector: `[data-tour=quest-card-${tourQuestId}]`,
      resizeObservables: [`[data-tour=quest-card-${tourQuestId}]`],
      mutationObservables: [`[data-tour=quest-card-${tourQuestId}]`],
      position: "bottom",
      hidePrevButton: true,
      alignCenter: true,
      nextButtonTitle: "Next",
      handleNextAction: () => {
        setIsFinishModalOpen(true);
        setIsOpen(false);
      },
      content: () => (
        <ContentComponent
          content="Woohoo!"
          subHeader="Congrats on creating your first quest. All of the quests you create will live on this page."
          typographyProps={{
            textAlign: "center",
            paddingTop: "24px",
            paddingBottom: "8px",
          }}
          wrapperProps={{
            sx: {
              padding: "0px",
              paddingBottom: "16px",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            },
          }}
        />
      ),
    },
  ];

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

  const handleTourStart = () => {
    if (completedGuides && !completedGuides?.includes(TUTORIALS.COMMUNITIES_QUESTS_PAGE_GUIDE)) {
      setIsModalOpen(true);
    }
    if (
      completedGuides &&
      !completedGuides?.includes(TUTORIALS.POST_CREATE_QUEST_QUESTS_PAGE_GUIDE) &&
      completedGuides?.includes(TUTORIALS.COMMUNITIES_QUESTS_PAGE_GUIDE) &&
      tourQuestId
    ) {
      setSteps(POST_QUEST_CREATE_STEPS);
      setIsOpen(true);
      setCurrentStep(0);
    }
  };
  useEffect(() => {
    handleTourStart();
    return () => {
      setIsOpen(false);
      setCurrentStep(0);
      setSteps([]);
    };
  }, []);

  //TODO: replace image with higher quality - ask Ben
  return (
    <>
      {isFinishModalOpen ? (
        <FinishModalComponent
          onClose={() => setIsFinishModalOpen(false)}
          header={"Quests tour complete!"}
          imgBgColor={"#D5AEFD"}
          img={"/images/tour-images/quests-page.png"}
          subHeader={"Now it’s time to get creative. Start testing out other quest templates and create your own."}
          bodyText={"To learn more about our other features, just select them on the sidebar and begin the tour."}
        />
      ) : (
        false
      )}
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
    </>
  );
};

export default QuestsTutorial;
