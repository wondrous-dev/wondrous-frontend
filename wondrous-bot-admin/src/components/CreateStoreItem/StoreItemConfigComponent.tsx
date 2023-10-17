import { Grid } from "@mui/material";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import TextField from "components/Shared/TextField";
import { useContext, useEffect, useMemo, useState } from "react";
import { DELIVERY_METHODS, NFT_ORIGIN_TYPES, STORE_ITEM_TYPES } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import ProductImage from "./ProductImage";
import TokenStoreItem from "./components/TokenStoreItem";
import SelectComponent from "components/Shared/Select";
import DiscordRoles from "./components/DiscordRoles";

const StoreItemConfigComponent = ({ storeItemData, setStoreItemData, onTypeChange }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);

  const COMPONENTS = {
    [STORE_ITEM_TYPES.PHYSICAL]: {
      component: TextField,
      label: "Shopify link",
      componentProps: {
        multiline: false,
        type: "url",
        width: "100%",
        value: storeItemData.config.url,
        error: errors["url"],
        onChange: (value) => {
          setStoreItemData((prev) => ({
            ...prev,
            config: {
              ...prev.config,
              url: value,
            },
          }));
          if (errors["url"]) {
            setErrors((prev) => ({
              ...prev,
              url: null,
            }));
          }
        },
      },
    },
    [STORE_ITEM_TYPES.NFT]: {
      component: TokenStoreItem,
      componentProps: {
        value: storeItemData?.config?.nftMetadataId,
        postInitialFetch: (data) => {
          const hasMedia = storeItemData?.mediaUploads?.length;
          const option = data?.getCommunityNFTsForOrg?.find((item) => item.id === storeItemData?.config?.nftMetadataId);
          if (storeItemData?.config?.nftMetadataId && !storeItemData?.config?.nftType) {
            setStoreItemData((prev) => ({
              ...prev,
              config: {
                ...prev.config,
                nftType: option?.tokenId ? NFT_ORIGIN_TYPES.CREATED : NFT_ORIGIN_TYPES.IMPORTED,
              },
              ...(!hasMedia
                ? {
                    mediaUploads: [
                      {
                        slug: option?.mediaUrl,
                      },
                    ],
                  }
                : {}),
            }));
          }
        },
        onChange: (nftItem) => {
          setStoreItemData((prev) => ({
            ...prev,
            config: {
              ...prev.config,
              nftMetadataId: nftItem?.id,
              nftType: nftItem?.tokenId ? NFT_ORIGIN_TYPES.CREATED : NFT_ORIGIN_TYPES.IMPORTED,
            },
            mediaUploads: [
              {
                slug: nftItem?.mediaUrl,
              },
            ],
          }));
        },
        key: "nftMetadataId",
        errors,
        setErrors,
      },
      label: "NFT",
    },
    [STORE_ITEM_TYPES.DISCORD_ROLE]: {
      component: DiscordRoles,
      label: "Discord Role",
    },
  };

  const TYPES = [
    {
      label: "Shopify",
      value: STORE_ITEM_TYPES.PHYSICAL,
    },
    {
      label: "NFT",
      value: STORE_ITEM_TYPES.NFT,
    },
    {
      label: "Discord Role",
      value: STORE_ITEM_TYPES.DISCORD_ROLE,
    },
  ];

  const handleTypeChange = (type) => {
    const additionalChanges: any = {};
    if (type === storeItemData.type) return null;

    if (storeItemData.type === STORE_ITEM_TYPES.NFT) {
      additionalChanges.mediaUploads = [];
    }

    if (type === STORE_ITEM_TYPES.PHYSICAL) {
      additionalChanges.deliveryMethod = DELIVERY_METHODS.DISCOUNT_CODE;
    }
    if (type === STORE_ITEM_TYPES.DISCORD_ROLE) {
      additionalChanges.deliveryMethod = DELIVERY_METHODS.DISCORD_ROLE;
    }
    if (type === STORE_ITEM_TYPES.NFT) {
      additionalChanges.deliveryMethod = DELIVERY_METHODS.NFT_PAYMENT;
    }
    setStoreItemData((prev) => ({
      ...prev,
      type,
      config: {},
      ...additionalChanges,
    }));
    onTypeChange(type);
  };

  const Config: any = COMPONENTS[storeItemData.type];

  const DELIVERY_METHODS_OPTIONS = [
    {
      label: "Discord Role",
      value: DELIVERY_METHODS.DISCORD_ROLE,
      disabled: storeItemData.type !== STORE_ITEM_TYPES.DISCORD_ROLE,
    },
    {
      label: "Discount Code",
      value: DELIVERY_METHODS.DISCOUNT_CODE,
      disabled:
        storeItemData.type !== STORE_ITEM_TYPES.PHYSICAL &&
        storeItemData?.config?.nftType !== NFT_ORIGIN_TYPES.IMPORTED,
    },
    {
      label: "NFT Payment",
      value: DELIVERY_METHODS.NFT_PAYMENT,
      disabled: storeItemData.type !== STORE_ITEM_TYPES.NFT,
    },
    {
      label: "Raffle",
      value: DELIVERY_METHODS.RAFFLE,
      disabled: storeItemData.type !== STORE_ITEM_TYPES.PHYSICAL,
    },
  ];

  const componentProps = useMemo(() => Config?.componentProps, [Config]);

  return (
    <Grid display="flex" flexDirection="column" justifyContent="flex-start" gap="24px" alignItems="center" width="100%">
      <PanelComponent
        renderBody={() => {
          return (
            <Grid display="flex" flexDirection="column" gap="24px" width="100%">
              <Grid display="flex" flexDirection="column" gap="12px">
                <Label fontWeight={600}>Product type</Label>

                <AutocompleteOptionsComponent
                  options={TYPES}
                  value={storeItemData.type}
                  placeholder="Select Product Type"
                  onChange={handleTypeChange}
                />
              </Grid>
              <Grid display="flex" flexDirection="column" gap="12px">
                <Label fontWeight={600}>{Config.label}</Label>

                <Config.component
                  setStoreItemData={setStoreItemData}
                  storeItemData={storeItemData}
                  {...componentProps}
                />
              </Grid>
              <Grid display="flex" flexDirection="column" gap="12px">
                <Label fontWeight={600}>Delivery method</Label>
                <SelectComponent
                  options={DELIVERY_METHODS_OPTIONS}
                  value={storeItemData.deliveryMethod || null}
                  onChange={(value) => setStoreItemData((prev) => ({ ...prev, deliveryMethod: value }))}
                />
              </Grid>
              {storeItemData?.deliveryMethod === DELIVERY_METHODS.RAFFLE && (
                <Grid display="flex" flexDirection="column" gap="12px">
                  <Label fontWeight={600}>Delivery Message</Label>
                  <TextField
                    multiline={false}
                    width="100%"
                    value={storeItemData.deliveryMessage}
                    onChange={(value) => setStoreItemData((prev) => ({ ...prev, deliveryMessage: value }))}
                  ></TextField>
                </Grid>
              )}
            </Grid>
          );
        }}
      />
      <PanelComponent
        renderBody={() => {
          return (
            <Grid display="flex" flexDirection="column" gap="24px" width="100%">
              <Grid display="flex" flexDirection="column" gap="12px">
                <Label fontWeight={600}>Product image</Label>
                <ProductImage storeItemData={storeItemData} setStoreItemData={setStoreItemData} />
              </Grid>
            </Grid>
          );
        }}
      />
    </Grid>
  );
};

export default StoreItemConfigComponent;
