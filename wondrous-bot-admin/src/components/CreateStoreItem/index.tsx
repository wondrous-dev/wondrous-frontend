import { Box, Grid } from "@mui/material";
import { CampaignOverviewHeader } from "components/CreateTemplate/CampaignOverview";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import PageWrapper from "components/Shared/PageWrapper";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BG_TYPES, STORE_ITEM_TYPES } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import useAlerts from "utils/hooks";
import StoreItemSettingsComponent from "./StoreItemSettingsComponent";
import StoreItemConfigComponent from "./StoreItemConfigComponent";

// orgId: String
// name: String
// type: String
// description: String
// ptPrice: Int
// price: Int
// mediaUploads: [MediaUploadInput]
// deliveryMethod: String
// url: String
// additionalData: String
// tokenInfo: String

export const DEFAULT_STORE_ITEM_SETTINGS_STATE_VALUE = {
  description: null,
  title: null,
  ptPrice: null,
  price: null,
  deliveryMethod: null,
  url: null,
  additionalData: null,
  tokenInfo: null,
};

const DEFAULT_STORE_ITEM_DATA = {
  type: STORE_ITEM_TYPES.PHYSICAL,
  config : {
    url: null
  }
};

const CreateStoreItem = ({
  setRefValue,
  defaultStoreItemData = DEFAULT_STORE_ITEM_DATA,
  defaultStoreItemStetings = DEFAULT_STORE_ITEM_SETTINGS_STATE_VALUE,
}) => {
  const navigate = useNavigate();
  const { errors, setErrors } = useContext(CreateQuestContext);
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAutoHideDuration } = useAlerts();

  const { activeOrg } = useContext(GlobalContext);

  const [storeItemData, setStoreItemData] = useState(defaultStoreItemData);
  const [storeItemSettings, setStoreItemSettings] = useState(defaultStoreItemStetings);

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
              renderHeader={() => <CampaignOverviewHeader title="Product Settings" />}
              renderBody={() => <StoreItemSettingsComponent storeItemSettings={storeItemSettings} setStoreItemSettings={setStoreItemSettings}/>}
            />
          </Box>
          <StoreItemConfigComponent setStoreItemData={setStoreItemData}
          storeItemData={storeItemData}
          />
        </Grid>
      </PageWrapper>
    </>
  );
};

export default CreateStoreItem;
