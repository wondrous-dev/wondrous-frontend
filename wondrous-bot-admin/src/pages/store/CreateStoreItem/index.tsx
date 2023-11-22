import CreateStoreItem from "components/CreateStoreItem";
import StoreModule from "components/ModulesActivation/StoreModule";
import PageHeader from "components/PageHeader";
import { PricingOptionsTitle, getPlan } from "components/Pricing/PricingOptionsListItem";
import QuestTitle from "components/QuestTitle";
import TextField from "components/Shared/TextField";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useContext, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import useAlerts, { usePaywall, useSubscription } from "utils/hooks";
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
