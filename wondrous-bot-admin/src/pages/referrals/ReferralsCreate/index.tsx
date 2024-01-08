import CreateStoreItem from "components/CreateStoreItem";
import PageHeader from "components/PageHeader";
import SingleReferralComponent from "components/SingleReferralComponent";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useRef, useState } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";
import useCreateReferralTutorial from "components/TutorialComponent/CreateReferralTutorial";
import { useTour } from "@reactour/tour";

const ReferralsCreatePage = () => {
  const [errors, setErrors] = useState({});

  const headerActionsRef = useRef(null);

  const setRefValue = (value) => (headerActionsRef.current = value);

  useCreateReferralTutorial();

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
            <SharedSecondaryButton
              data-tour="tutorial-referral-save-button"
              onClick={() => headerActionsRef.current?.handleSave()}
            >
              Save Referral
            </SharedSecondaryButton>
          )}
        />
        <SingleReferralComponent setRefValue={setRefValue} />
      </CreateQuestContext.Provider>
    </>
  );
};

export default ReferralsCreatePage;
