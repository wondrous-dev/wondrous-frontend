import ConfirmActionModal from "components/ConfirmActionModal";
import Switch from "components/Shared/Switch";
import { useState } from "react";

const OnboardingComponent = (props) => {
  const { onChange, setEntitySettings } = props;
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(null);

  const handleChange = (value) => {
    const sharedModalProps = {
      onConfirm: () => {
        onChange(value);
        if (value) {
          setEntitySettings((prev) => ({
            ...prev,
            level: "1",
          }));
        }
        setIsConfirmationModalOpen(false);
      },
      onCancel: () => {
        setIsConfirmationModalOpen(false);
      },
      onClose: () => setIsConfirmationModalOpen(false),
    };
    if (value) {
      return setIsConfirmationModalOpen({
        title: "Set this quest as onboarding quest?",
        body: "This quest will be set as onboarding quest for new members",
        confirmButtonTitle: "Set as onboarding",
        ...sharedModalProps,
      });
    }
    return setIsConfirmationModalOpen({
      title: "Remove this quest as onboarding quest?",
      body: "This quest will be removed as onboarding quest for new members",
      confirmButtonTitle: "Remove as onboarding",
      ...sharedModalProps,
    });
  };

  return (
    <>
      <ConfirmActionModal isOpen={isConfirmationModalOpen} {...isConfirmationModalOpen} />

      <Switch {...props} onChange={handleChange} />
    </>
  );
};

export default OnboardingComponent;
