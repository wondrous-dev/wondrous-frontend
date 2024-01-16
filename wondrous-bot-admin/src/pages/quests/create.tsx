import { Box } from "@mui/material";
import QuestTemplateModal from "components/CreateTemplate/QuestTemplateModal";
import { DEFAULT_QUEST_SETTINGS_STATE_VALUE } from "components/CreateTemplate/shared";
import PageHeader from "components/PageHeader";
import { SharedSecondaryButton } from "components/Shared/styles";
import React, { Suspense, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import CreateQuestContext from "utils/context/CreateQuestContext";
import useCreateQuestTutorial from "components/TutorialComponent/Tutorials/CreateQuestTutorial";
import { useTour } from "@reactour/tour";

const CreateTemplate = React.lazy(() => import("components/CreateTemplate"));

const CreatePage = () => {
  const headerActionsRef = useRef(null);
  const [errors, setErrors] = useState({});
  const { ref, inView, entry } = useInView({
    threshold: 1,
  });
  const [questTemplate, setQuestTemplate] = useState({
    steps: [],
    questSettings: DEFAULT_QUEST_SETTINGS_STATE_VALUE,
    open: true,
  });

  const setRefValue = (value) => (headerActionsRef.current = value);

  const { setCurrentStep, isOpen } = useTour();
  useCreateQuestTutorial({ shouldDisplay: questTemplate.open });

  const handleOnClose = () => {
    setQuestTemplate((prev) => ({ ...prev, open: false }));
    if (isOpen) return setCurrentStep((prev) => prev + 1);
  };

  const handleSelect = ({ steps, rewards, requireReview, title }) => {
    setQuestTemplate((prev) => ({
      ...prev,
      open: false,
      steps,
      questSettings: {
        ...prev.questSettings,
        rewards,
        requireReview,
        title,
      },
    }));
    if (isOpen) return setCurrentStep((prev) => prev + 1);
  };

  const handleSaveQuest = () => {
    if(isOpen) setCurrentStep((prev) => prev + 1);
    return headerActionsRef.current?.handleSave()
  };

  return (
    <>
      <QuestTemplateModal handleSelect={handleSelect} handleOnClose={handleOnClose} open={questTemplate.open} />
      <CreateQuestContext.Provider
        value={{
          errors,
          setErrors,
        }}
      >
        <Box ref={ref}>
          <PageHeader
            withBackButton
            title="Create Quest"
            renderActions={() => (
              <SharedSecondaryButton data-tour="tour-save-quest" onClick={handleSaveQuest}>
                Save Quest
              </SharedSecondaryButton>
            )}
          />
        </Box>
        {entry && !questTemplate.open && (
          <Suspense>
            <CreateTemplate
              defaultSteps={questTemplate.steps}
              defaultQuestSettings={questTemplate.questSettings}
              setRefValue={setRefValue}
            />
          </Suspense>
        )}
      </CreateQuestContext.Provider>
    </>
  );
};

export default CreatePage;
