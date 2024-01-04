import { useMe } from "components/Auth";
import ContentComponent from "../ContentComponent";
import { useContext, useEffect } from "react";
import { useModalState } from "../shared";
import { TUTORIALS } from "utils/constants";
import { TourDataContext } from "utils/context";
import { useTour } from "@reactour/tour";

// 'data-tour': 'tour-submissions-empty-state',
// data-tour="tour-submissions-filter-buttons"
// data-tour="tour-submissions-title"

const ViewQuestTutorial = () => {
  const { user } = useMe() || {};

  const { setCurrentId } = useContext(TourDataContext);
  const { setSteps, isOpen, setIsOpen, setCurrentStep } = useTour();
  const completedGuides = [];
  const STEPS = [
    {
      selector: "[data-tour=tour-submissions-empty-state]",
      action: (node) => {
        // we need to wait for the empty state to mount
        const submissionsTitle = document.querySelector("[data-tour=tour-submissions-title]");
        const submissionsFilterButtons = document.querySelectorAll("[data-tour=tour-submissions-filter-buttons]") || [];
        const elements = [submissionsTitle, ...submissionsFilterButtons];
        elements.forEach((element) => {
          if (!element) return;
          element.style.zIndex = 3;
        });
      },
      content: () => (
        <ContentComponent
          content="Here is your quest view page! Your community’s submissions will appear here."
          subHeader="Browse submissions and review them here. If you want to edit the content of your quest, hit edit quest at the top!"
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
  ];

  useEffect(() => {
    if (completedGuides && !completedGuides?.includes(TUTORIALS.POST_CREATE_QUEST)) {
      setCurrentId(TUTORIALS.POST_CREATE_QUEST);
      setSteps(STEPS);
      setCurrentStep(0);
      setIsOpen(true);
    }
    return () => setCurrentId(null);
  }, []);

  return null;
};

export default ViewQuestTutorial;
