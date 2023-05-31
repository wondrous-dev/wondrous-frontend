import CreateTemplate from "components/CreateTemplate";
import { TitleInput } from "components/CreateTemplate/styles";
import PageHeader from "components/PageHeader";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import CreateQuestContext from "utils/context/CreateQuestContext";

const CreatePage = () => {
  const headerActionsRef = useRef(null);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const { ref, inView, entry } = useInView({
    threshold: 1,
  });

  const setRefValue = (value) => (headerActionsRef.current = value);

  return (
    <>
      <CreateQuestContext.Provider
        value={{
          errors,
          setErrors,
        }}
      >
        <div ref={ref}>
          <PageHeader
            withBackButton
            titleComponent={() => (
              <TitleInput
                maxRows={2}
                multiline
                rows={1}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Quest Title"
              />
            )}
            renderActions={() => (
              <SharedSecondaryButton onClick={() => headerActionsRef.current?.handleSave()}>
                Save Quest
              </SharedSecondaryButton>
            )}
          />
        </div>
        <CreateTemplate setRefValue={setRefValue} displaySavePanel={!inView} title={title} />
      </CreateQuestContext.Provider>
    </>
  );
};

export default CreatePage;
