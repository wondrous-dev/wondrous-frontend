import { useQuery } from "@apollo/client";
import CreateStoreItem from "components/CreateStoreItem";
import PageHeader from "components/PageHeader";

import { SharedSecondaryButton } from "components/Shared/styles";
import { GET_STORE_ITEM_BY_ID } from "graphql/queries";
import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateQuestContext from "utils/context/CreateQuestContext";
import DiscountCodeModal from "./DiscountCodeModal";
import ViewStoreItem from "components/ViewStoreItem";
import StoreModule from "components/ModulesActivation/StoreModule";
import { useStorePaywall } from "utils/storeUtils";

const StoreItem = () => {
  const headerActionsRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [openDiscountUploadModal, setOpenDiscountUploadModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  let { id } = useParams();
  const { data, loading } = useQuery(GET_STORE_ITEM_BY_ID, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "network-only",
    variables: {
      storeItemId: id,
    },
    skip: !id,
  });

  const setRefValue = (value) => (headerActionsRef.current = value);

  const { __typename, ...restAdditionalData } = data?.getStoreItem?.additionalData || {};

  const { isActivateModuleModalOpen, handleSuccess } = useStorePaywall();

  const defaultStoreItemSettings = useMemo(() => {
    return {
      name: data?.getStoreItem?.name,
      description: data?.getStoreItem?.description,
      ptPrice: data?.getStoreItem?.ptPrice,
      conditionLogic: data?.getStoreItem?.conditionLogic,
      price: data?.getStoreItem?.price,
      deactivatedAt: data?.getStoreItem?.deactivatedAt,
      id: data?.getStoreItem?.id,
      maxPurchase: data?.getStoreItem?.maxPurchase,
      storeItemConditions: data?.getStoreItem?.conditions
        ? data?.getStoreItem?.conditions?.map((condition) => {
            const { __typename, ...rest } = condition?.conditionData;
            return {
              type: condition?.type,
              conditionData: rest,
            };
          })
        : null,
    };
  }, [data?.getStoreItem]);

  const defaultStoreItemData = {
    mediaUploads: data?.getStoreItem?.media || [],
    deliveryMethod: data?.getStoreItem?.deliveryMethod,
    deliveryMessage: data?.getStoreItem?.deliveryMessage,
    config: {
      url: data?.getStoreItem?.url,
      nftMetadataId: data?.getStoreItem?.nftMetadataId,
      additionalData: restAdditionalData,
    },
    type: data?.getStoreItem?.type,
  };

  const isDeactivated = !!data?.getStoreItem?.deactivatedAt;

  const buttonTitle = isEditMode ? "Save store item" : "Edit store item";

  const handleOnClick = () => {
    if (isEditMode) return headerActionsRef.current?.handleSave();
    return setIsEditMode(true);
  };
  if (isActivateModuleModalOpen) return <StoreModule onSuccess={handleSuccess} onCancel={() => navigate("/")} />;
  if (!data) return null;
  return (
    <>
      <CreateQuestContext.Provider
        value={{
          errors,
          setErrors,
        }}
      >
        <DiscountCodeModal
          openDiscountUploadModal={openDiscountUploadModal}
          setOpenDiscountUploadModal={setOpenDiscountUploadModal}
          itemId={data?.getStoreItem?.id}
        />
        <PageHeader
          withBackButton
          title={isEditMode ? "Edit Store Item" : "View Store Item"}
          renderActions={() => (
            <>
              <SharedSecondaryButton $reverse={isDeactivated} onClick={handleOnClick} disabled={isDeactivated}>
                {isDeactivated ? "Product deactivated" : buttonTitle}
              </SharedSecondaryButton>
            </>
          )}
        />
        {isEditMode ? (
          <CreateStoreItem
            setRefValue={setRefValue}
            defaultStoreItemData={defaultStoreItemData}
            defaultStoreItemStetings={defaultStoreItemSettings}
          />
        ) : (
          <ViewStoreItem data={data?.getStoreItem} />
        )}
      </CreateQuestContext.Provider>
    </>
  );
};

export default StoreItem;
