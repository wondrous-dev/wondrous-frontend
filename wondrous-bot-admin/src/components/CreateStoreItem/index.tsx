import { Box, Grid } from "@mui/material";
import { CampaignOverviewHeader } from "components/CreateTemplate/CampaignOverview";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import PageWrapper from "components/Shared/PageWrapper";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BG_TYPES, CONDITION_TYPES, DELIVERY_METHODS, STORE_ITEM_TYPES } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import useAlerts from "utils/hooks";
import StoreItemSettingsComponent from "./StoreItemSettingsComponent";
import StoreItemConfigComponent from "./StoreItemConfigComponent";
import { useMutation } from "@apollo/client";
import {
  ATTACH_STORE_ITEM_MEDIA,
  CREATE_STORE_ITEM,
  REMOVE_STORE_ITEM_MEDIA,
  UPDATE_STORE_ITEM,
} from "graphql/mutations/cmtyStore";
import moment from "moment";
import { ValidationError, storeItemValidator } from "services/validators";
import { getPathArray } from "utils/common";
import { set } from "lodash";
import { handleMediaUpload } from "utils/media";
import useCreateStoreItemTutorial from "components/TutorialComponent/Tutorials/CreateStoreItemTutorial";
import { useTour } from "@reactour/tour";

export const DEFAULT_STORE_ITEM_SETTINGS_STATE_VALUE = {
  description: null,
  name: null,
  ptPrice: null,
  price: null,
  deactivatedAt: null,
  id: null,
  maxPurchase: null,
  storeItemConditions: [],
  conditionLogic: "and",
  quantity: null,
};

const DEFAULT_STORE_ITEM_DATA = {
  type: STORE_ITEM_TYPES.EXTERNAL_SHOP,
  deliveryMethod: DELIVERY_METHODS.DISCOUNT_CODE,
  mediaUploads: [],
  config: {
    url: null,
  },
  deliveryMessage: null,
};

const CreateStoreItem = ({
  setRefValue,
  defaultStoreItemData = DEFAULT_STORE_ITEM_DATA,
  defaultStoreItemStetings = DEFAULT_STORE_ITEM_SETTINGS_STATE_VALUE,
}) => {
  const navigate = useNavigate();

  const [attachStoreItemMedia] = useMutation(ATTACH_STORE_ITEM_MEDIA, {
    refetchQueries: ["getStoreItem"],
  });

  const [removeStoreItemMedia] = useMutation(REMOVE_STORE_ITEM_MEDIA, {
    refetchQueries: ["getStoreItem"],
  });
  const { errors, setErrors } = useContext(CreateQuestContext);
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAutoHideDuration } = useAlerts();
  const [storeItemData, setStoreItemData] = useState<any>({ ...defaultStoreItemData });
  const [storeItemSettings, setStoreItemSettings] = useState({ ...defaultStoreItemStetings });

  const {isOpen} = useTour();
  const [createStoreItem] = useMutation(CREATE_STORE_ITEM, {
    onCompleted: (data) => {
      handleUpdateStoreItemMedia(data?.createStoreItem?.id, storeItemData?.mediaUploads);
      const tourPath = isOpen ? "/store" : `/store?tourStoreItemId${data?.createStoreItem?.id}`;
      navigate(tourPath);
    },
  });

  const [updateStoreItem] = useMutation(UPDATE_STORE_ITEM, {
    onCompleted: (data) => {
      handleUpdateStoreItemMedia(data?.updateStoreItem?.id, storeItemData?.mediaUploads);
      navigate(`/store`);
    },
  });
  const { activeOrg } = useContext(GlobalContext);

  const onTypeChange = (newType) => {
    setErrors({});
  };

  const handleUpdateStoreItemMedia = async (storeItemId, mediaUploads) => {
    const mediaToUpload = mediaUploads.filter((media) => media instanceof File);
    const media = await handleMediaUpload(mediaToUpload);

    await attachStoreItemMedia({
      variables: {
        storeItemId,
        mediaUploads: media,
      },
    });
  };

  const handleMutation = async (body) => {
    if (storeItemSettings?.id) {
      await updateStoreItem({
        variables: {
          storeItemId: storeItemSettings?.id,
          input: body,
        },
      });
      return;
    }
    await createStoreItem({
      variables: {
        input: body,
      },
    });
  };

  const handleSave = async () => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }

    const filteredStoreItemConditions = storeItemSettings?.storeItemConditions?.filter(
      (condition) => condition.type && condition.conditionData
    );

    const body = {
      orgId: activeOrg.id,
      name: storeItemSettings.name,
      description: storeItemSettings.description,
      type: storeItemData.type,
      ptPrice: storeItemSettings.ptPrice ? parseInt(storeItemSettings.ptPrice) : null,
      price: storeItemSettings.price ? parseInt(storeItemSettings.price) : null,
      url: storeItemData?.config?.url || null,
      nftMetadataId: storeItemData?.config?.nftMetadataId,
      cmtyPaymentMethodId: storeItemData?.config?.cmtyPaymentMethodId,
      quantity: storeItemData?.quantity ? parseFloat(storeItemData?.quantity) : null,
      deliveryMethod: storeItemData.deliveryMethod,
      deliveryMessage: storeItemData.deliveryMessage,
      deactivatedAt: storeItemSettings?.deactivatedAt ? moment().toISOString() : null,
      additionalData: storeItemData?.config?.additionalData,
      maxPurchase: storeItemSettings?.maxPurchase ? parseInt(storeItemSettings?.maxPurchase) : null,
      ...(storeItemData?.discountCodeImport?.codes && {
        discountCodeImport: {
          codes: storeItemData?.discountCodeImport?.codes,
          type: storeItemData?.discountCodeImport?.type,
          scheme: storeItemData?.discountCodeImport?.scheme,
          discount: Number(storeItemData?.discountCodeImport?.discount),
        },
      }),
      conditionLogic: storeItemSettings?.conditionLogic,
      storeItemConditions: filteredStoreItemConditions?.map((condition) => {
        if (condition.type === CONDITION_TYPES.LEVEL) {
          return {
            type: condition.type,
            conditionData: {
              minLevel: parseInt(condition.conditionData.minLevel),
            },
          };
        }
        return condition;
      }),
    };
    try {
      await storeItemValidator(body);
      await handleMutation(body);

      const storeItemDataMediaUploads = Array.isArray(storeItemData?.mediaUploads) ? storeItemData?.mediaUploads : [];
      const defaultStoreItemDataMediaUploads = Array.isArray(defaultStoreItemData?.mediaUploads)
        ? defaultStoreItemData?.mediaUploads
        : [];

      const hasMediaToUpload = storeItemDataMediaUploads.some((media) => media instanceof File);

      const storeItemSlugs = storeItemDataMediaUploads.filter((media) => media?.slug).map((media) => media.slug); // Ensures that you are working with the slug strings directly.

      const mediaSlugsToRemove = defaultStoreItemDataMediaUploads
        .filter((media) => !storeItemSlugs.includes(media?.slug))
        .map((media) => media?.slug); // Map to get the slugs to remove.

      if (hasMediaToUpload) {
        setSnackbarAlertMessage("Wrapping up with your media. Please keep this window open");
        setSnackbarAlertAutoHideDuration(2000);
        setSnackbarAlertOpen(true);
      }
      if (mediaSlugsToRemove?.length > 0) {
        await removeStoreItemMedia({
          variables: {
            storeItemId: storeItemSettings?.id,
            // until we support more media
            slug: mediaSlugsToRemove[0],
          },
        });
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        err.inner.forEach((error) => {
          console.log("error", error);
          console.log(error.path, "ERR PATH");
          const path = getPathArray(error.path);
          set(errors, path, error.message);
        });

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        setErrors(errors);
      }
    }
  };

  useMemo(() => setRefValue({ handleSave }), [setRefValue, handleSave]);

  useCreateStoreItemTutorial(defaultStoreItemData?.type, storeItemData?.type);
  return (
    <>
      <PageWrapper
        containerProps={{
          direction: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          minHeight: "100vh",
          padding: {
            xs: "14px 14px 120px 14px",
            sm: "24px 56px 150px 24px",
          },
        }}
        bgType={BG_TYPES.QUESTS}
      >
        <Grid
          display="flex"
          justifyContent="space-between"
          width="100%"
          gap="24px"
          flexDirection={{
            xs: "column",
            lg: "row",
          }}
        >
          <Box flexBasis="40%" display="flex" flexDirection="column" gap="24px">
            <PanelComponent
              panelProps={{
                "data-tour": "tutorial-store-item-settings",
              }}
              renderHeader={() => <CampaignOverviewHeader title="Product Settings" />}
              renderBody={() => (
                <StoreItemSettingsComponent
                  storeItemSettings={storeItemSettings}
                  setStoreItemSettings={setStoreItemSettings}
                />
              )}
            />
          </Box>
          <StoreItemConfigComponent
            setStoreItemData={setStoreItemData}
            onTypeChange={onTypeChange}
            storeItemData={storeItemData}
            storeItemSettings={storeItemSettings}
          />
        </Grid>
      </PageWrapper>
    </>
  );
};

export default CreateStoreItem;
