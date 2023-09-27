import { Box, Grid } from "@mui/material";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import ImageUpload from "components/ImageUpload";
import { AVATAR_EDITOR_TYPES } from "components/ImageUpload/AvatarEditor";
import TextField from "components/Shared/TextField";
import { useContext } from "react";
import { STORE_ITEM_TYPES } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import { ImageUploadWrapper } from "./styles";
import ProductImage from "./ProductImage";
import { TokenComponent } from "components/CreateTemplate/RewardUtils";

const StoreItemConfigComponent = ({ storeItemData, setStoreItemData }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const { activeOrg } = useContext(GlobalContext);

  const COMPONENTS = {
    [STORE_ITEM_TYPES.PHYSICAL]: {
      component: TextField,
      label: "Shopify link",
      componentProps: {
        multiline: false,
        type: "url",
        width: "100%",
        value: storeItemData.config.url,
        onChange: (value) =>
          setStoreItemData((prev) => ({
            ...prev,
            config: {
              ...prev.config,
              url: value,
            },
          })),
      },
    },
    [STORE_ITEM_TYPES.NFT]: {
      component: TokenComponent,
      label: "NFT",
      componentProps: {
        multiline: false,
        addPaymentMethod: () => {},
        type: "url",
        options: [
          { label: "ERC721", value: "erc721" },
          { label: "ERC1155", value: "erc1155" },
        ],
        onChange: (value) =>
          setStoreItemData((prev) => ({
            ...prev,
            config: {
              ...prev.config,
              url: value,
            },
          })),
      },
    },
    [STORE_ITEM_TYPES.DISCORD_ROLE]: {
      component: TextField,
      label: "Discord Role",
      componentProps: {
        multiline: false,
        type: "url",
        onChange: (value) =>
          setStoreItemData((prev) => ({
            ...prev,
            config: {
              ...prev.config,
              url: value,
            },
          })),
      },
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
    const config = {};
    setStoreItemData((prev) => ({
      ...prev,
      type,
      config,
    }));
  };

  const Config = COMPONENTS[storeItemData.type];
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

                <Config.component {...COMPONENTS[storeItemData.type].componentProps} />
              </Grid>
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
                <ProductImage />
              </Grid>
            </Grid>
          );
        }}
      />
    </Grid>
  );
};

export default StoreItemConfigComponent;
