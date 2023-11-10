import CreateStoreItem from "components/CreateStoreItem";
import PageHeader from "components/PageHeader";
import ReferralsCreateComponent from "components/ReferralsCreateComponent";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useRef, useState } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";

const ReferralsCreatePage = () => {
  const [errors, setErrors] = useState({});

  const headerActionsRef = useRef(null);

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
          title="Create Referral"
          renderActions={() => (
            <SharedSecondaryButton onClick={() => headerActionsRef.current?.handleSave()}>
              Save Referral
            </SharedSecondaryButton>
          )}
        />
        <ReferralsCreateComponent setRefValue={setRefValue} />
      </CreateQuestContext.Provider>
    </>
  );
};

export default ReferralsCreatePage;
