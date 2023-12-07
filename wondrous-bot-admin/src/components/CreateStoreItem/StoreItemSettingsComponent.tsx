import Grid from "@mui/material/Grid";
import TextField from "components/Shared/TextField";

import { Label } from "components/CreateTemplate/styles";
import { useContext, useMemo } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { CONDITION_TYPES } from "utils/constants";
import ActivateStoreItem from "./components/ActivateStoreItem";
import MaxInput from "components/CreateTemplate/MaxInput";
import DynamicCondition from "components/DynamicCondition";

type StoreItemSettingsConfig = {
  label?: string;
  component?: any;
  value?: string;
  componentProps?: any;
  key?: string;
  divider?: boolean;
  direction?: string;
};

const StoreItemSettingsComponent = ({ storeItemSettings, setStoreItemSettings }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const config = useMemo(() => {
    let data: StoreItemSettingsConfig[] = [
      {
        label: "Store Item Title",
        component: TextField,
        value: storeItemSettings.title,
        componentProps: {
          multiline: false,
          placeholder: "Enter store item title",
          error: errors["name"],
        },
        key: "name",
      },
      {
        label: "Store Item Description",
        component: TextField,
        componentProps: {
          multiline: true,
          placeholder: "Enter store item description",
        },
        value: storeItemSettings.description,
        key: "description",
      },
      {
        divider: true,
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
        label: "Max Purchases",
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
          conditionLogic: storeItemSettings?.conditionLogic,
          value: storeItemSettings.storeItemConditions,
          options: [CONDITION_TYPES.LEVEL, CONDITION_TYPES.DISCORD_ROLE],
        },
      },
      {
        label: "Activate Store Item",
        direction: "row",
        component: ActivateStoreItem,
        key: "deactivatedAt",
        componentProps: {
          value: !storeItemSettings?.deactivatedAt,
          storeItemId: storeItemSettings?.id,
        },
      },
    ];
    return data;
  }, [storeItemSettings]);

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

  return (
    <>
      {config.map(
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
