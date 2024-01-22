import { useTour } from "@reactour/tour";
import { useMemo, useEffect } from "react";
import { TYPES } from "utils/constants";

const useDynamicSteps = ({ steps, getQuestById, defaultSteps }) => {
  const { setCurrentStep, isOpen, currentStep, steps: tourSteps } = useTour();

  const currentStepConfig = tourSteps?.[currentStep];

  const isAddStepActive = currentStepConfig?.selector === "[data-tour=tutorial-add-quest-step]";

  const tourStepIdxPostAdding = useMemo(() => {
    if (!isAddStepActive) return null;
    return tourSteps.findIndex((step) => step.selector === "[data-tour=tutorial-add-quest-step]") + 1;
  }, [tourSteps, isAddStepActive]);

  const tourIsQuestStepSelected = currentStepConfig?.selector === "[data-tour=tour-quest-step]";

  const tourStepIdxOnTypeChange = useMemo(() => {
    return tourSteps?.findIndex((step: any) => step.id === "tour-selected-step");
  }, [tourSteps]);

  useEffect(() => {
    if (!isOpen || getQuestById) return;
    if (
      tourStepIdxOnTypeChange &&
      steps?.length !== defaultSteps?.length &&
      steps[steps.length - 1]?.type !== (defaultSteps?.[defaultSteps?.length - 1]?.type || TYPES.TEXT_FIELD) &&
      tourIsQuestStepSelected
    ) {
      return setCurrentStep(tourStepIdxOnTypeChange);
    }
    if (steps?.length !== defaultSteps?.length && isOpen && tourStepIdxPostAdding) {
      return setCurrentStep(tourStepIdxPostAdding);
    }
  }, [steps, isOpen, tourStepIdxPostAdding, tourStepIdxOnTypeChange, tourIsQuestStepSelected]);
  return null;
};
export default useDynamicSteps;
