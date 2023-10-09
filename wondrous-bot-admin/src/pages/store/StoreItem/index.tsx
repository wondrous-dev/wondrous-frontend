import { useQuery } from "@apollo/client";
import { CircularProgress } from "@mui/material";
import CreateStoreItem from "components/CreateStoreItem";
import PageHeader from "components/PageHeader";
import PageSpinner from "components/PageSpinner";
import TextField from "components/Shared/TextField";

import QuestTitle from "components/QuestTitle";
import { SharedSecondaryButton } from "components/Shared/styles";
import { GET_STORE_ITEM_BY_ID } from "graphql/queries";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CreateQuestContext from "utils/context/CreateQuestContext";

const StoreItem = () => {
  const headerActionsRef = useRef(null);
  const [errors, setErrors] = useState({});

  let { id, ...rest } = useParams();
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

  const normalizdItem = useMemo(() => {
    if (!data?.getStoreItem?.id) return null;

    const { __typename, ...restAdditionalData } = data?.getStoreItem?.additionalData || {};
    return {
      id: data?.getStoreItem?.id,
      name: data?.getStoreItem?.name,
      description: data?.getStoreItem?.description,
      ptPrice: data?.getStoreItem?.ptPrice,
      price: data?.getStoreItem?.price,
      mediaUploads: data?.getStoreItem?.media,
      deliveryMethod: data?.getStoreItem?.deliveryMethod,
      url: data?.getStoreItem?.url,
      additionalData: restAdditionalData,
      nftMetadataId: data?.getStoreItem?.nftMetadataId,
      deactivatedAt: data?.getStoreItem?.deactivatedAt,
      type: data?.getStoreItem?.type,
      maxPurchase: data?.getStoreItem?.maxPurchase,
    };
  }, [data?.getStoreItem]);

  const defaultStoreItemSettings = {
    name: normalizdItem?.name,
    description: normalizdItem?.description,
    ptPrice: normalizdItem?.ptPrice,
    price: normalizdItem?.price,
    deliveryMethod: normalizdItem?.deliveryMethod,
    deactivatedAt: normalizdItem?.deactivatedAt,
    id: normalizdItem?.id,
    maxPurchase: normalizdItem?.maxPurchase
  };

  const defaultStoreItemData = {
    mediaUploads: normalizdItem?.mediaUploads || [],
    config: {
      url: normalizdItem?.url,
      nftMetadataId: normalizdItem?.nftMetadataId,
      additionalData: normalizdItem?.additionalData,
    },
    type: normalizdItem?.type,
  };

  if (!normalizdItem?.id) {
    return <PageSpinner />;
  }

  const isDeactivated = !!data?.getStoreItem?.deactivatedAt;
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
          title={normalizdItem?.name || "Product Listing"}
          renderActions={() => (
            <SharedSecondaryButton
              $reverse={isDeactivated}
              onClick={() => headerActionsRef.current?.handleSave()}
              disabled={isDeactivated}
            >
              {isDeactivated ? "Product deactivated" : "Update Product"}
            </SharedSecondaryButton>
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
