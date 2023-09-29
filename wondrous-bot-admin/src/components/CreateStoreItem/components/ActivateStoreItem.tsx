import { useMutation } from "@apollo/client";
import ConfirmActionModal from "components/ConfirmActionModal";
import Switch from "components/Shared/Switch";
import { ACTIVATE_STORE_ITEM, DEACTIVATE_STORE_ITEM } from "graphql/mutations/cmtyStore";
import { useState } from "react";

const ActivateStoreItem = (props) => {
  const { storeItemId, value: isActive } = props;
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(null);

  const [activateStoreItem] = useMutation(ACTIVATE_STORE_ITEM, {
    refetchQueries: ["getStoreItem", "getStoreItemsForOrg"],
  });

  const [deactivateStoreItem] = useMutation(DEACTIVATE_STORE_ITEM, {
    refetchQueries: ["getStoreItem", "getStoreItemsForOrg"],
  });

  const handleChange = (value) => {
    const sharedModalProps = {
      onConfirm: async () => {
        if (value && !isActive) {
          await activateStoreItem({
            variables: {
              storeItemId,
            },
          });
        }

        if (!value && isActive) {
          await deactivateStoreItem({
            variables: {
              storeItemId,
            },
          });
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
        title: "Activate this store item?",
        body: "This store item will be activated",
        confirmButtonTitle: "Activate",
        ...sharedModalProps,
      });
    }
    return setIsConfirmationModalOpen({
      title: "Deactivate this store item?",
      body: "This store item will be deactivated and won't be available in the store",
      confirmButtonTitle: "Deactivate",
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

export default ActivateStoreItem;
