import QuestTemplateModal from "components/CreateTemplate/QuestTemplateModal";
import { DEFAULT_QUEST_SETTINGS_STATE_VALUE } from "components/CreateTemplate/utils";
import { TitleInput } from "components/CreateTemplate/styles";
import PageHeader from "components/PageHeader";
import QuestTitle from "components/QuestTitle";
import { SharedSecondaryButton } from "components/Shared/styles";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import CreateQuestContext from "utils/context/CreateQuestContext";

const CreateTemplate = React.lazy(() => import("components/CreateTemplate"));

const CreatePage = () => {
  const headerActionsRef = useRef(null);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const { ref, inView, entry } = useInView({
    threshold: 1,
  });
  const [questTemplate, setQuestTemplate] = useState({
    steps: [],
    questSettings: DEFAULT_QUEST_SETTINGS_STATE_VALUE,
    open: true,
    title,
  });

  const setRefValue = (value) => (headerActionsRef.current = value);

  const titleValue = title || questTemplate.title;

  useEffect(() => {
    return () => {
      setQuestTemplate({
        steps: [],
        questSettings: DEFAULT_QUEST_SETTINGS_STATE_VALUE,
        open: true,
        title: "",
      });
    }
  }, [])
  return (
    <>
      <QuestTemplateModal setQuestTemplate={setQuestTemplate} open={questTemplate.open} />
      <CreateQuestContext.Provider
        value={{
          errors,
          setErrors,
        }}
      >
        <div ref={ref}>
          <PageHeader
            withBackButton
            titleComponent={() => <QuestTitle title={titleValue} setTitle={setTitle} />}
            renderActions={() => (
              <SharedSecondaryButton onClick={() => headerActionsRef.current?.handleSave()}>
                Save Quest
              </SharedSecondaryButton>
            )}
          />
        </div>
        {entry && !questTemplate.open && (
          <Suspense>
            <CreateTemplate
              defaultSteps={questTemplate.steps}
              defaultQuestSettings={questTemplate.questSettings}
              setRefValue={setRefValue}
              displaySavePanel={!inView}
              title={titleValue}
            />
          </Suspense>
        )}
      </CreateQuestContext.Provider>
    </>
  );
};

export default CreatePage;
