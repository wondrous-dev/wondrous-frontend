import Grid from "@mui/material/Grid";
import TextField from "components/Shared/TextField";

import { Label } from "components/CreateTemplate/styles";
import { useContext, useEffect, useMemo, useState } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";
import SelectComponent from "components/Shared/Select";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { CONDITION_TYPES, DELIVERY_METHODS } from "utils/constants";
import ActivateStoreItem from "./components/ActivateStoreItem";
import MaxInput from "components/CreateTemplate/MaxInput";
import DynamicCondition from "components/DynamicCondition";
import { useLazyQuery } from "@apollo/client";
import { GET_STORE_ITEM_DISCOUNT_CODE_INFO } from "graphql/queries";
import { DiscountEdit } from "./components/DiscountEdit";

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
  const [getDiscountCodeInfo, { data: discountInfoData }] = useLazyQuery(GET_STORE_ITEM_DISCOUNT_CODE_INFO);
  const discountInfo = discountInfoData?.getStoreItemDiscountCodeInfo;
  const config = useMemo(() => {
    let data: StoreItemSettingsConfig[] = [
      {
        label: "Product title",
        component: TextField,
        value: storeItemSettings.title,
        componentProps: {
          multiline: false,
          placeholder: "Enter product title",
          error: errors["name"],
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
          conditionLogic: storeItemSettings?.conditionLogic,
          value: storeItemSettings.storeItemConditions,
          options: [CONDITION_TYPES.LEVEL, CONDITION_TYPES.DISCORD_ROLE],
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
    if (discountInfo?.itemId) {
      const newConfig = data.filter((c) => c.key !== "storeItemDiscountCode");
      data = [
        ...newConfig,
        {
          label: "Discount Codes",
          direction: "row",
          component: (props) => <DiscountEdit {...props} />,
          key: "storeItemDiscountCode",
          componentProps: {
            storeItem: storeItemSettings,
            discountInfo,
          },
        },
      ];
    }
    return data;
  }, [discountInfo, storeItemSettings]);

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

  useEffect(() => {
    if (storeItemSettings?.id) {
      getDiscountCodeInfo({
        variables: {
          storeItemId: storeItemSettings?.id,
        },
      });
    }
  }, [storeItemSettings?.id]);

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
