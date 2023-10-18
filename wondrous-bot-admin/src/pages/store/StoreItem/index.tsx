import { useLazyQuery, useQuery } from "@apollo/client";
import { CircularProgress } from "@mui/material";
import CreateStoreItem from "components/CreateStoreItem";
import PageHeader from "components/PageHeader";
import PageSpinner from "components/PageSpinner";
import TextField from "components/Shared/TextField";

import QuestTitle from "components/QuestTitle";
import { SharedBlackOutlineButton, SharedSecondaryButton } from "components/Shared/styles";
import { GET_STORE_ITEM_BY_ID } from "graphql/queries";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CreateQuestContext from "utils/context/CreateQuestContext";
import DiscountCodeModal from "./DiscountCodeModal";
import ViewStoreItem from "components/ViewStoreItem";

const StoreItem = () => {
  const headerActionsRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [openDiscountUploadModal, setOpenDiscountUploadModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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

  const defaultStoreItemSettings = useMemo(() => {
    return {
      name: data?.getStoreItem?.name,
      description: data?.getStoreItem?.description,
      ptPrice: data?.getStoreItem?.ptPrice,
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

  const buttonTitle = isEditMode ? "Save product" : "Edit product";

  const handleOnClick = () => {
    if (isEditMode) return headerActionsRef.current?.handleSave();
    return setIsEditMode(true);
  };
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
          title={isEditMode ? "Edit Product" : "View Product"}
          renderActions={() => (
            <>
              {isEditMode ? (
                <SharedBlackOutlineButton
                  onClick={() => {
                    setOpenDiscountUploadModal(true);
                  }}
                >
                  Upload discount codes
                </SharedBlackOutlineButton>
              ) : null}
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
