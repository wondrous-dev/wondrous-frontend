import { Box } from "@mui/material";
import QuestTemplateModal from "components/CreateTemplate/QuestTemplateModal";
import { DEFAULT_QUEST_SETTINGS_STATE_VALUE } from "components/CreateTemplate/shared";
import PageHeader from "components/PageHeader";
import DiscordRoleDisclaimer from "components/Shared/DiscordRoleDisclaimer";
import { SharedSecondaryButton } from "components/Shared/styles";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import CreateQuestContext from "utils/context/CreateQuestContext";
import Confetti from "react-confetti";
import useWindowSize from "utils/useWindowSize";
import useCreateQuestTutorial from "components/TutorialComponent/CreateQuestTutorial";

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

  useCreateQuestTutorial({ shouldDisplay: questTemplate.open });
  return (
    <>
      <QuestTemplateModal setQuestTemplate={setQuestTemplate} open={questTemplate.open} />
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
              <SharedSecondaryButton data-tour="tour-save-quest" onClick={() => headerActionsRef.current?.handleSave()}>
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
