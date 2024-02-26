import { useTour } from "@reactour/tour";
import ContentComponent from "components/TutorialComponent/ContentComponent";
import { useContext, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { TUTORIALS } from "utils/constants";
import { TourDataContext } from "utils/context";
import { useSubscriptionPaywall, useUserCompletedGuides } from "utils/hooks";

const useCreateStoreItemTutorial = (initialType, currentType) => {
  let { id } = useParams();
  const completedGuides = useUserCompletedGuides();

  const { setSteps, setIsOpen, setCurrentStep, isOpen, currentStep } = useTour();

  const { handleTourVisit, setShouldForceOpenTour, shouldForceOpenTour } = useContext(TourDataContext);
  const isBasicPLan = false;
  const plan = true;
  const steps: any = [
    {
      selector: "[data-tour=tutorial-store-item-type]",
      position: "left",
      highlightedSelectors: ["[data-tour=tutorial-store-item-panel]"],
      resizeObservables: ["[data-tour=tutorial-store-item-panel]"],
      mutationObservables: ["[data-tour=tutorial-store-item-panel]"],
      id: "store-item-type-selector",
      content: () => (
        <ContentComponent
          content="Select the product type"
          subHeader="Select external shop if you want to link the product to an existing product. Or you can natively sell NFTs or Discord Roles."
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
      action: () => {
        if (shouldForceOpenTour) setShouldForceOpenTour(false);
      },
      selector: "[data-tour=tutorial-store-item-info]",
      highlightedSelectors: ["[data-tour=tutorial-store-item-panel]"],
      resizeObservables: ["[data-tour=tutorial-store-item-panel]"],
      mutationObservables: ["[data-tour=tutorial-store-item-panel]"],
      position: "left",
      content: () => (
        <ContentComponent
          content="Enter the store item information"
          subHeader="We have deep guides on how to set-up the product here if you have more questions."
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
      selector: "[data-tour=tutorial-store-item-title]",
      highlightedSelectors: ["[data-tour=tutorial-store-item-settings]"],
      resizeObservables: ["[data-tour=tutorial-store-item-settings]"],
      mutationObservables: ["[data-tour=tutorial-store-item-settings]"],
      position: "right",
      content: () => (
        <ContentComponent
          content="Update the product settings"
          subHeader="Change the title and description if you like or edit requirements. If you click advanced options you can further customize the quest settings."
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
      selector: "[data-tour=tutorial-store-item-image]",
      highlightedSelectors: ["[data-tour=tutorial-store-item-image-panel]"],
      resizeObservables: ["[data-tour=tutorial-store-item-image-panel]"],
      mutationObservables: ["[data-tour=tutorial-store-item-image-panel]"],
      position: "left",
      content: () => (
        <ContentComponent
          content="Set the product image"
          subHeader="This banner will be what your community sees. If you have an image add one or you can use one of our default ones as a placeholder!"
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
      selector: "[data-tour=tutorial-store-item-save]",
      position: "left",
      hideButtons: true,
      content: () => (
        <ContentComponent
          content="Save your product"
          wrapperProps={{
            sx: {
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            },
          }}
        />
      ),
    },
  ];
  const currentStepConfig = steps[currentStep];
  const handleChanges = () => {
    if (currentStepConfig?.id === "store-item-type-selector" && currentType !== initialType) {
      setCurrentStep(1);
    }
  };

  useEffect(() => {
    handleChanges();
  }, [currentType, currentStep]);

  useEffect(() => {
    if (shouldForceOpenTour) {
      handleTourVisit(TUTORIALS.STORE_ITEMS_CREATE_PAGE_GUIDE);
      setSteps(steps);
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, [shouldForceOpenTour]);

  useEffect(() => {
    if (completedGuides && !completedGuides?.includes(TUTORIALS.STORE_ITEMS_CREATE_PAGE_GUIDE)) {
      handleTourVisit(TUTORIALS.STORE_ITEMS_CREATE_PAGE_GUIDE);
      setSteps(steps);
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, []);
};

export default useCreateStoreItemTutorial;
