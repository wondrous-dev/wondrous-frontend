import { Box } from "@mui/material";
import ModalComponent from "components/TutorialComponent/ModalComponent";
import { ModalLabel, ModalTextBody } from "components/TutorialComponent/styles";
import FinishModalComponent from "../shared/FinishModalComponent";
import { useTour } from "@reactour/tour";
import { useState, useContext, useEffect } from "react";
import { TourDataContext } from "utils/context";
import { TUTORIALS } from "utils/constants";
import ContentComponent from "components/TutorialComponent/ContentComponent";
import { useLocation } from "react-router-dom";
import { useUserCompletedGuides } from "utils/hooks";

const StoreItemsTutorial = () => {
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const completedGuides = useUserCompletedGuides();
  const { handleTourVisit, shouldForceOpenTour, setShouldForceOpenTour } = useContext(TourDataContext);
  const { setIsOpen, isOpen, setSteps, currentStep, setCurrentStep } = useTour();

  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);

  const tourStoreItemId = searchParams.get("tourStoreItemId") || 0;

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  //TODO: fix popover
  const STEPS = [
    {
      selector: "[data-tour=tutorial-store-items-page-new-store-item-button]",
      content: () => (
        <ContentComponent
          content="Let's create a store item"
          wrapperProps={{
            sx: {
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            },
          }}
        />
      ),
      hideButtons: true,
    },
  ];

  const handleStart = () => {
    setSteps(STEPS);
    setIsModalOpen(false);
    setIsOpen(true);
    handleTourVisit(TUTORIALS.STORE_ITEMS_PAGE_GUIDE);
  };

  const handleSkip = () => handleTourVisit(TUTORIALS.STORE_ITEMS_PAGE_GUIDE);

  const POST_STORE_ITEM_CREATE_STEPS: any = [
    {
      selector: `[data-tour=tutorial-store-items-page-store-item-${tourStoreItemId}]`,
      resizeObservables: [`[data-tour=tutorial-store-items-page-store-item-${tourStoreItemId}]`],
      mutationObservables: [`[data-tour=tutorial-store-items-page-store-item-${tourStoreItemId}]`],
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
          subHeader="Congrats on creating your first store item. All of the store items you create will live on this page."
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

  const handleTourStart = () => {
    if (isOpen) return;
    if (shouldForceOpenTour) setShouldForceOpenTour(false);
    if (completedGuides && (!completedGuides?.includes(TUTORIALS.STORE_ITEMS_PAGE_GUIDE) || shouldForceOpenTour)) {
      setIsModalOpen(true);
    }
    if (
      completedGuides &&
      !completedGuides?.includes(TUTORIALS.STORE_ITEMS_POST_CREATE_PAGE_GUIDE) &&
      completedGuides?.includes(TUTORIALS.STORE_ITEMS_PAGE_GUIDE)
    ) {
      handleTourVisit(TUTORIALS.STORE_ITEMS_POST_CREATE_PAGE_GUIDE);
      setSteps(POST_STORE_ITEM_CREATE_STEPS);
      setIsOpen(true);
      setCurrentStep(0);
    }
  };
  useEffect(() => {
    handleTourStart();
  }, [shouldForceOpenTour, isOpen]);

  useEffect(() => {
    return () => {
      setIsOpen(false);
      setCurrentStep(0);
      setSteps([]);
    };
  }, []);
  return (
    <>
      {isFinishModalOpen ? (
        <FinishModalComponent
          onClose={() => setIsFinishModalOpen(false)}
          header={"Store tour complete!"}
          imgBgColor={"#D5AEFD"}
          img={"/images/tour-images/store-page.png"}
          subHeader={"Creating a store will give your members another reason to be excited about your community."}
          bodyText={"To learn more about our other features, just select them on the sidebar and begin the tour."}
        />
      ) : null}
      <ModalComponent
        isModalOpen={isModalOpen}
        onClose={handleModalClose}
        imgSrc={"/images/tour-images/store-page.png"}
        onStart={handleStart}
        onSkip={handleSkip}
      >
        <Box display="flex" flexDirection="column" gap="8px">
          <ModalLabel>Open your store</ModalLabel>
          <ModalTextBody>Welcome to your store. Let’s get it setup.</ModalTextBody>
          <ModalTextBody>
            For more info check <a href="#">out this video.</a>
          </ModalTextBody>
        </Box>
      </ModalComponent>
    </>
  );
};

export default StoreItemsTutorial;
