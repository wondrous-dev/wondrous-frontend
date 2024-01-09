import { useTour } from "@reactour/tour";
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

  // const { isActivateModuleModalOpen, handleSuccess } = useStorePaywall();
  const setRefValue = (value) => (headerActionsRef.current = value);
  const { isOpen, setCurrentStep } = useTour();
  return (
    <>
      {/* {isActivateModuleModalOpen ? <StoreModule onSuccess={handleSuccess} onCancel={() => navigate("/")} /> : null} */}

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
            <SharedSecondaryButton
              data-tour="tutorial-store-item-save"
              onClick={() => {
                if (isOpen) setCurrentStep((prev) => prev + 1);
                return headerActionsRef.current?.handleSave();
              }}
            >
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
