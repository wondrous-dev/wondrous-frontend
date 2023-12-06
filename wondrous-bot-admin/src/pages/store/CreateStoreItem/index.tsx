import CreateStoreItem from "components/CreateStoreItem";
import StoreModule from "components/ModulesActivation/StoreModule";
import PageHeader from "components/PageHeader";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { useStorePaywall } from "utils/storeUtils";

const CreateStoreItemPage = () => {
  const headerActionsRef = useRef(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { isActivateModuleModalOpen, handleSuccess } = useStorePaywall();
  const setRefValue = (value) => (headerActionsRef.current = value);

  return (
    <>
      {isActivateModuleModalOpen ? <StoreModule onSuccess={handleSuccess} onCancel={() => navigate("/")} /> : null}

      <CreateQuestContext.Provider
        value={{
          errors,
          setErrors,
        }}
      >
        <PageHeader
          withBackButton
          title="Add Store Item"
          renderActions={() => (
            <SharedSecondaryButton onClick={() => headerActionsRef.current?.handleSave()}>
              Save Store Item
            </SharedSecondaryButton>
          )}
        />
        <CreateStoreItem setRefValue={setRefValue} />
      </CreateQuestContext.Provider>
    </>
  );
};

export default CreateStoreItemPage;
