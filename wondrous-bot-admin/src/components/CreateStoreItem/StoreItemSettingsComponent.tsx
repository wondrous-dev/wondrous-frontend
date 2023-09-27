import Grid from "@mui/material/Grid";
import TextComponent from "components/AddFormEntity/components/Text";
import TextField from "components/Shared/TextField";

import { Label } from "components/CreateTemplate/styles";
import { useContext, useMemo } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import SelectComponent from "components/Shared/Select";
import useLevels from "utils/levels/hooks";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import Switch from "components/Shared/Switch";

const StoreItemSettingsComponent = ({ storeItemSettings, setStoreItemSettings }) => {
  const { activeOrg } = useContext(GlobalContext);
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

  const { levels } = useLevels({
    orgId: activeOrg?.id,
  });

  const levelsOptions = useMemo(() => {
    return Object.keys(levels).map((key) => ({
      label: levels[key],
      value: key,
    }));
  }, [levels]);

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
      label: "Level Req.",
      direction: "row",
      component: SelectComponent,
      value: storeItemSettings.level,
      componentProps: {
        options: levelsOptions,
      },
      key: "level",
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
      label: "Active Product",
      direction: "row",
      component: Switch,
      key: "isActive",
      value: storeItemSettings?.isActive,
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
