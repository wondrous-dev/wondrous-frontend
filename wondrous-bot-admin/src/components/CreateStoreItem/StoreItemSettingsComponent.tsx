import Grid from "@mui/material/Grid";
import TextField from "components/Shared/TextField";

import { Label } from "components/CreateTemplate/styles";
import { useContext } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";
import SelectComponent from "components/Shared/Select";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { CONDITION_TYPES, DELIVERY_METHODS } from "utils/constants";
import ActivateStoreItem from "./components/ActivateStoreItem";
import MaxInput from "components/CreateTemplate/MaxInput";
import DynamicCondition from "components/DynamicCondition";

const StoreItemSettingsComponent = ({ storeItemSettings, setStoreItemSettings }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const handleChange = (key, value) => {
    if (errors[key]) {
      setErrors({
        ...errors,
        [key]: null,
      });
    }
    setStoreItemSettings({
      ...storeItemSettings,
      [key]: value,
    });
  };

  const CONFIG = [
    {
      label: "Product title",
      component: TextField,
      value: storeItemSettings.title,
      componentProps: {
        multiline: false,
        placeholder: "Enter product title",
      },
      key: "name",
    },
    {
      label: "Product description",
      component: TextField,
      componentProps: {
        multiline: true,
        placeholder: "Enter product description",
      },
      value: storeItemSettings.description,
      key: "description",
    },
    {
      divider: true,
    },
    {
      label: "Delivery method",
      direction: "row",
      component: SelectComponent,
      value: storeItemSettings.deliveryMethod,
      componentProps: {
        options: [
          {
            label: "Discord Role",
            value: DELIVERY_METHODS.DISCORD_ROLE,
          },
          {
            label: "Discount Code",
            value: DELIVERY_METHODS.DISCOUNT_CODE,
          },
          {
            label: "NFT Payment",
            value: DELIVERY_METHODS.NFT_PAYMENT,
          },
        ],
      },
      key: "deliveryMethod",
    },
    {
      label: "Price",
      direction: "row",
      key: "price",
      component: TextField,
      componentProps: {
        type: "number",
        multiline: false,
        placeholder: "Price",
      },
    },
    {
      label: "Price in Points",
      direction: "row",
      key: "ptPrice",
      component: TextField,
      componentProps: {
        type: "number",
        multiline: false,
        placeholder: "Price in Points",
      },
    },
    {
      label: "Max purchases",
      direction: "row",
      key: "maxPurchase",
      component: MaxInput,
      componentProps: {
        keyValue: storeItemSettings?.maxPurchase,
        handleValueChange: (value) => handleChange("maxPurchase", value),
        onChange: (value) => {
          if (!value && storeItemSettings?.maxPurchase) {
            return handleChange("maxPurchase", null);
          }
          return handleChange("maxPurchase", 1);
        },
      },
    },
    {
      label: "Conditions",
      component: DynamicCondition,
      direction: "row",
      key: "storeItemConditions",
      componentProps: {
        handleUpdate: setStoreItemSettings,
        value: storeItemSettings.storeItemConditions,
        options: [CONDITION_TYPES.LEVEL, CONDITION_TYPES.DISCORD_ROLE]
      },
    },
    {
      label: "Activate Product",
      direction: "row",
      component: ActivateStoreItem,
      key: "deactivatedAt",
      componentProps: {
        value: !storeItemSettings?.deactivatedAt,
        storeItemId: storeItemSettings?.id,
      },
    },
  ];
  
  return (
    <>
      {CONFIG.map(
        (
          {
            divider = false,
            direction = "column",
            label,
            component: Component,
            key,
            componentProps = {},
            wrapperProps = {},
          }: any,
          idx
        ) => {
          return divider ? (
            <Divider key={idx} />
          ) : (
            <Grid
              display="flex"
              justifyContent="flex-start"
              flexDirection={direction}
              alignItems={direction === "column" ? "flex-start" : "center"}
              width="100%"
              gap="12px"
              key={key}
              {...wrapperProps}
            >
              <Label fontWeight={600}>{label}</Label>
              {Component ? (
                <Component
                  onChange={(value) => handleChange(key, value)}
                  error={errors[key]}
                  stateKey={key}
                  value={storeItemSettings[key]}
                  questSettings={storeItemSettings}
                  setQuestSettings={setStoreItemSettings}
                  {...componentProps}
                />
              ) : null}
            </Grid>
          );
        }
      )}
    </>
  );
};

export default StoreItemSettingsComponent;
