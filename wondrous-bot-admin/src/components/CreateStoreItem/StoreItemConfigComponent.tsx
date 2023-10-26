import { Grid, Box, Typography } from "@mui/material";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import TextField from "components/Shared/TextField";
import { useContext, useEffect, useMemo, useState } from "react";
import { DELIVERY_METHODS, NFT_ORIGIN_TYPES, STORE_ITEM_TYPES, DELIVERY_METHOD_LABELS } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import ProductImage from "./ProductImage";
import TokenStoreItem from "./components/TokenStoreItem";
import SelectComponent from "components/Shared/Select";
import DiscordRoles from "./components/DiscordRoles";
import DiscountCodeModal, { DEFAULT_CODES_DATA } from "pages/store/StoreItem/DiscountCodeModal";
import { ErrorText, SharedButton } from "components/Shared/styles";
import DeleteIcon from "components/Icons/Delete";
import { redColors } from "utils/theme/colors";
import ViewDiscountCodeModal from "pages/store/StoreItem/ViewDiscountCodesModal";

let apeironRaffle = false;
const StoreItemConfigComponent = ({ storeItemData, setStoreItemData, onTypeChange, storeItemSettings }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const { activeOrg } = useContext(GlobalContext);
  const [openDiscountUploadModal, setOpenDiscountUploadModal] = useState(false);
  const [openViewDiscounModal, setOpenViewDiscounModal] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState("");
  const COMPONENTS = {
    [STORE_ITEM_TYPES.EXTERNAL_SHOP]: {
      component: TextField,
      label: "External shop link",
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
      label: "External Shop",
      value: STORE_ITEM_TYPES.EXTERNAL_SHOP,
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

    if (type === STORE_ITEM_TYPES.EXTERNAL_SHOP) {
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
      label: DELIVERY_METHOD_LABELS[DELIVERY_METHODS.DISCORD_ROLE],
      value: DELIVERY_METHODS.DISCORD_ROLE,
      disabled: storeItemData.type !== STORE_ITEM_TYPES.DISCORD_ROLE,
    },
    {
      label: DELIVERY_METHOD_LABELS[DELIVERY_METHODS.DISCOUNT_CODE],
      value: DELIVERY_METHODS.DISCOUNT_CODE,
      disabled:
        storeItemData.type !== STORE_ITEM_TYPES.EXTERNAL_SHOP &&
        storeItemData?.config?.nftType !== NFT_ORIGIN_TYPES.IMPORTED,
    },
    {
      label: DELIVERY_METHOD_LABELS[DELIVERY_METHODS.NFT_PAYMENT],
      value: DELIVERY_METHODS.NFT_PAYMENT,
      disabled: storeItemData.type !== STORE_ITEM_TYPES.NFT,
    },
  ];

  const componentProps = useMemo(() => Config?.componentProps, [Config]);

  useEffect(() => {
    if (activeOrg?.id === "98989259425317451" && !apeironRaffle) {
      DELIVERY_METHODS_OPTIONS.push({
        label: DELIVERY_METHOD_LABELS[DELIVERY_METHODS.RAFFLE],
        value: DELIVERY_METHODS.RAFFLE,
        disabled: storeItemData.type !== STORE_ITEM_TYPES.EXTERNAL_SHOP && storeItemData.type !== STORE_ITEM_TYPES.NFT,
      });
    }
  }, [activeOrg?.id]);
  return (
    <Grid display="flex" flexDirection="column" justifyContent="flex-start" gap="24px" alignItems="center" width="100%">
      <DiscountCodeModal
        openDiscountUploadModal={openDiscountUploadModal}
        setOpenDiscountUploadModal={setOpenDiscountUploadModal}
        itemId={storeItemSettings?.id}
        setFilenameOnCreate={setUploadedFilename}
        deliveryMethod={storeItemData?.deliveryMethod}
        setCodesOnCreate={(value) => {
          setStoreItemData({
            ...storeItemData,
            discountCodeImport: {
              type: value?.type,
              scheme: value?.scheme,
              discount: value?.discount,
              codes: value?.codes,
            },
          });
        }}
      />
      <ViewDiscountCodeModal
        openViewDiscounModal={openViewDiscounModal}
        setOpenViewDiscounModal={setOpenViewDiscounModal}
        itemId={storeItemSettings?.id}
      />
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
              {(storeItemData?.deliveryMethod === DELIVERY_METHODS.RAFFLE ||
                storeItemData?.deliveryMethod === DELIVERY_METHODS.DISCOUNT_CODE) && (
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
              {(storeItemData?.deliveryMethod === DELIVERY_METHODS.EXTERNAL_CODE ||
                storeItemData?.deliveryMethod === DELIVERY_METHODS.DISCOUNT_CODE) && (
                <Grid display="flex" flexDirection="column" gap="12px">
                  <Label fontWeight={600}>Upload Code list</Label>
                  {uploadedFilename && storeItemData?.discountCodeImport?.codes?.length > 0 ? (
                    <Box display="flex" alignItems="center">
                      <Box
                        style={{
                          backgroundColor: "rgba(193, 182, 246, 1)",
                        }}
                        borderRadius="8px"
                        marginRight="8px"
                      >
                        <Typography
                          fontFamily="Poppins"
                          fontWeight={500}
                          fontSize="12px"
                          color="black"
                          padding="2px 8px"
                          borderRadius="60px"
                        >
                          {uploadedFilename}
                        </Typography>
                      </Box>
                      <DeleteIcon
                        stroke={redColors.red400}
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setStoreItemData({
                            ...storeItemData,
                            discountCodeImport: null,
                          });
                        }}
                      />
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center">
                      {storeItemSettings?.id && (
                        <SharedButton
                          style={{
                            backgroundColor: "rgba(193, 182, 246, 1)",
                            width: "fit-content",
                            color: "black",
                            fontSize: "15px",
                            marginRight: "8px",
                          }}
                          onClick={() => {
                            setOpenViewDiscounModal(true);
                          }}
                        >
                          View Codes
                        </SharedButton>
                      )}
                      <SharedButton
                        style={{
                          backgroundColor: "rgba(193, 182, 246, 1)",
                          width: "fit-content",
                          color: "black",
                          fontSize: "15px",
                        }}
                        onClick={() => setOpenDiscountUploadModal(true)}
                      >
                        {storeItemSettings?.id ? "Upload More Codes" : "Upload Codes"}
                      </SharedButton>
                    </Box>
                  )}
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
