import { Grid } from "@mui/material";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import TextField from "components/Shared/TextField";
import { useContext } from "react";
import { STORE_ITEM_TYPES } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import ProductImage from "./ProductImage";
import TokenStoreItem from "./components/TokenStoreItem";
import SelectComponent from "components/Shared/Select";
import DiscordRoles from "./components/DiscordRoles";

const StoreItemConfigComponent = ({ storeItemData, setStoreItemData, onTypeChange }) => {
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
    const config = {};
    setStoreItemData((prev) => ({
      ...prev,
      type,
      config,
    }));
    onTypeChange(type);
  };

  const Config:any = COMPONENTS[storeItemData.type];

  console.log(storeItemData?.type ,'TYPE')
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
                  {...COMPONENTS[storeItemData.type].componentProps}
                  setStoreItemData={setStoreItemData}
                  storeItemData={storeItemData}
                />
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
