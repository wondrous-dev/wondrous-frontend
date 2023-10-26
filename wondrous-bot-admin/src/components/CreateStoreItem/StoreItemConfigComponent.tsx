import { Grid, Box, Typography } from "@mui/material";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import TextField from "components/Shared/TextField";
import { useContext, useEffect, useMemo, useState } from "react";
import { DELIVERY_METHODS, NFT_ORIGIN_TYPES, STORE_ITEM_TYPES, DELIVERY_METHOD_LABELS, LIMIT } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import ProductImage from "./ProductImage";
import TokenStoreItem from "./components/TokenStoreItem";
import SelectComponent from "components/Shared/Select";
import DiscordRoles from "./components/DiscordRoles";
import DiscountCodeModal, { DEFAULT_CODES_DATA } from "pages/store/StoreItem/DiscountCodeModal";
import { ButtonIconWrapper, ErrorText, SharedButton } from "components/Shared/styles";
import DeleteIcon from "components/Icons/Delete";
import { redColors } from "utils/theme/colors";
import ViewDiscountCodeModal from "pages/store/StoreItem/ViewDiscountCodesModal";
import { DiscountEdit } from "./components/DiscountEdit";
import { GET_ALL_STORE_ITEM_DISCOUNT_CODES, GET_STORE_ITEM_DISCOUNT_CODE_INFO } from "graphql/queries";
import { useLazyQuery } from "@apollo/client";
import DeleteDiscountCodesModal from "./components/DeleteDiscountCodesModal";

let apeironRaffle = false;
const StoreItemConfigComponent = ({ storeItemData, setStoreItemData, onTypeChange, storeItemSettings }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const [hasMore, setHasMore] = useState(false);
  const { activeOrg } = useContext(GlobalContext);
  const [getAllStoreItemDiscountCodes, { data: discountCodeData, error, fetchMore }] = useLazyQuery(
    GET_ALL_STORE_ITEM_DISCOUNT_CODES,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [openDeleteDiscountCodesModal, setOpenDeleteDiscountCodesModal] = useState(false);
  const [getDiscountCodeInfo, { data: discountInfoData }] = useLazyQuery(GET_STORE_ITEM_DISCOUNT_CODE_INFO);
  const discountCodes = discountCodeData?.getAllStoreItemDiscountCodes;
  const discountInfo = discountInfoData?.getStoreItemDiscountCodeInfo;
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
  useEffect(() => {
    if (storeItemSettings?.id) {
      getDiscountCodeInfo({
        variables: {
          storeItemId: storeItemSettings?.id,
        },
      });
      getAllStoreItemDiscountCodes({
        variables: {
          storeItemId: storeItemSettings?.id,
        },
      }).then((results) => {
        setHasMore(results?.data?.getAllStoreItemDiscountCodes?.length >= LIMIT);
      });
    }
  }, [storeItemSettings?.id]);

  const handleFetchMore = async () => {
    const res = await fetchMore({
      variables: {
        storeItemId: storeItemSettings?.id,
        offset: discountInfo?.length,
        limit: LIMIT,
      },
    });
    setHasMore(res?.data?.getCmtyUsersLeaderboard?.length >= LIMIT);
  };

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
      <DeleteDiscountCodesModal
        storeItemId={storeItemSettings?.id}
        openDeleteDiscountCodesModal={openDeleteDiscountCodesModal}
        setOpenDeleteDiscountCodesModal={setOpenDeleteDiscountCodesModal}
      />
      <ViewDiscountCodeModal
        openViewDiscounModal={openViewDiscounModal}
        setOpenViewDiscounModal={setOpenViewDiscounModal}
        itemId={storeItemSettings?.id}
        storeItemSettings={storeItemSettings}
        handleFetchMore={handleFetchMore}
        discountCodes={discountCodes}
        hasMore={hasMore}
        getAllStoreItemDiscountCodes={getAllStoreItemDiscountCodes}
      />
      <PanelComponent
        renderBody={() => {
          const deliveryMessage =
            storeItemData?.deliveryMethod === DELIVERY_METHODS.DISCOUNT_CODE
              ? `[EDIT ME] Use this code to get a X% discount when you visit our store/website.`
              : `[EDIT ME] Thanks for your purchase - you'll now be eligible for our raffle at the end of month`;
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
                  <Label fontWeight={600}>
                    {`${
                      storeItemData?.deliveryMethod === DELIVERY_METHODS.DISCOUNT_CODE
                        ? "Deliver Message: (message sent to user when they get their code)"
                        : "Post Purchase message"
                    }`}
                  </Label>
                  <TextField
                    multiline={false}
                    width="100%"
                    value={storeItemData.deliveryMessage || deliveryMessage}
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
                      {discountCodes?.length > 0 && (
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
                        {discountCodes?.length > 0 ? "Upload More Codes" : "Upload Codes"}
                      </SharedButton>
                      {discountCodes?.length > 0 && (
                        <>
                          <DiscountEdit discountInfo={discountInfo} />
                          <ButtonIconWrapper
                            onClick={() => {
                              setOpenDeleteDiscountCodesModal(true);
                            }}
                            style={{
                              width: "36px",
                              height: "36px",
                              marginLeft: "12px",
                            }}
                          >
                            <DeleteIcon />
                          </ButtonIconWrapper>
                        </>
                      )}
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
