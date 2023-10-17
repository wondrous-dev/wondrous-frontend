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

const StoreItem = () => {
  const headerActionsRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [openDiscountUploadModal, setOpenDiscountUploadModal] = useState(false);
  let { id } = useParams();
  const [getStoreItemById, { data, loading }] = useLazyQuery(GET_STORE_ITEM_BY_ID, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "network-only",
    variables: {
      storeItemId: id,
    },
  });

  useEffect(() => {
    if (!data && !loading) {
      getStoreItemById({
        variables: {
          storeItemId: id,
        },
      });
    }
  }, [data, loading]);

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
    config: {
      url: data?.getStoreItem?.url,
      nftMetadataId: data?.getStoreItem?.nftMetadataId,
      additionalData: restAdditionalData,
    },
    type: data?.getStoreItem?.type,
  };

  const isDeactivated = !!data?.getStoreItem?.deactivatedAt;

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
          title={data?.getStoreItem?.name || "Product Listing"}
          renderActions={() => (
            <>
              <SharedBlackOutlineButton
                onClick={() => {
                  setOpenDiscountUploadModal(true);
                }}
              >
                Upload discount codes
              </SharedBlackOutlineButton>
              <SharedSecondaryButton
                $reverse={isDeactivated}
                onClick={() => headerActionsRef.current?.handleSave()}
                disabled={isDeactivated}
              >
                {isDeactivated ? "Product deactivated" : "Update Product"}
              </SharedSecondaryButton>
            </>
          )}
        />
        <CreateStoreItem
          setRefValue={setRefValue}
          defaultStoreItemData={defaultStoreItemData}
          defaultStoreItemStetings={defaultStoreItemSettings}
        />
      </CreateQuestContext.Provider>
    </>
  );
};

export default StoreItem;
