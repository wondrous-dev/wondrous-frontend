import { Switch } from "@mui/material";
import ConfirmActionModal from "components/ConfirmActionModal";
import SelectComponent from "components/Shared/Select";
import { useMemo, useState } from "react";
import { useGlobalContext } from "utils/hooks";
import useLevels from "utils/levels/hooks";

const LevelComponent = (props) => {
  const { activeOrg } = useGlobalContext();
  const { levels } = useLevels({
    orgId: activeOrg?.id,
  });

  const handleModal = (value) => {
    const sharedModalProps = {
      onConfirm: () => {
        onChange(value);
        if (value) {
          setQuestSettings((prev) => ({
            ...prev,
            level: null,
            isOnboarding: true,
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

  const levelsOptions = useMemo(() => {
    const levelOptions = Object.keys(levels).map((key) => ({
      label: levels[key],
      value: key,
    }));
    return [...levelOptions];
  }, [levels]);

  const handleChange = (value) => {
    if (value === null) return;

    return setQuestSettings((prev) => ({
      ...prev,
      level: value,
      isOnboarding: false,
    }));
  };

  const { onChange, setQuestSettings } = props;
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(null);

  return (
    <>
      <ConfirmActionModal isOpen={isConfirmationModalOpen} {...isConfirmationModalOpen} />

      <SelectComponent options={levelsOptions} {...props} onChange={handleChange} />
    </>
  );
};

export default LevelComponent;
