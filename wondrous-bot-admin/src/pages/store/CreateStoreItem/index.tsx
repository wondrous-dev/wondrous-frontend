import CreateStoreItem from "components/CreateStoreItem";
import PageHeader from "components/PageHeader";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useRef, useState } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";

const CreateStoreItemPage = () => {
  const headerActionsRef = useRef(null);
  const [errors, setErrors] = useState({});

  const setRefValue = (value) => (headerActionsRef.current = value);

  return (
    <>
      <CreateQuestContext.Provider
        value={{
          errors,
          setErrors,
        }}
      >
        <PageHeader
          withBackButton
          title="Add Product Listing"
          renderActions={() => (
            <SharedSecondaryButton onClick={() => headerActionsRef.current?.handleSave()}>
              Save Product
            </SharedSecondaryButton>
          )}
        />
        <CreateStoreItem setRefValue={setRefValue} />
      </CreateQuestContext.Provider>
    </>
  );
};

export default CreateStoreItemPage;
