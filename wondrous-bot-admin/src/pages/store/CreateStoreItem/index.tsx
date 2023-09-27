import CreateStoreItem from "components/CreateStoreItem";
import PageHeader from "components/PageHeader";
import QuestTitle from "components/QuestTitle";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import CreateQuestContext from "utils/context/CreateQuestContext";

const CreateStoreItemPage = () => {
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
            titleComponent={() => <QuestTitle title="Add Product Listing" />}
            renderActions={() => (
              <SharedSecondaryButton onClick={() => headerActionsRef.current?.handleSave()}>
                Save Product
              </SharedSecondaryButton>
            )}
          />
        </div>
        <CreateStoreItem setRefValue={setRefValue} />
      </CreateQuestContext.Provider>
    </>
  );
};

export default CreateStoreItemPage;
