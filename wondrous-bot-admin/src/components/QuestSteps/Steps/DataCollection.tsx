import { Grid, Box } from "@mui/material";
import TextField from "components/Shared/TextField";
import { ButtonIconWrapper } from "components/Shared/styles";
import { useMemo, useState } from "react";
import { DATA_COLLECTION_TYPES } from "utils/constants";

import AddIcon from "@mui/icons-material/Add";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import countries from "utils/countries";
import { useKeyboardEffect } from "./utils";
import CheckboxOption from "components/QuestSteps/Checkbox";

const SelectOption = ({ step, onChange, value = [] }) => {
  const [inputValue, setInputValue] = useState("");
  const allOptions = useMemo(() => {
    const initialOptionsTexts = step.options.map((opt) => opt.text);
    const addedOptions =
      value
        ?.filter((v) => !initialOptionsTexts.includes(v))
        .map((text, index) => ({
          text,
          position: step.options.length + index,
          correct: null,
          __typename: "QuestStepOption",
        })) || [];
    return [...step.options, ...addedOptions];
  }, [step.options, value]);

  const handleCheckboxChange = (optionText) => {
    if (value.includes(optionText)) {
      onChange(value.filter((v) => v !== optionText));
    } else {
      onChange([...value, optionText]);
    }
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleAddClick = () => {
    if (inputValue && !allOptions.find((opt) => opt.text === inputValue)) {
      onChange([...value, inputValue]);
      setInputValue("");
    }
  };

  const { onBlur, onFocus } = useKeyboardEffect();

  return (
    <Grid display="flex" flexDirection="column" gap="14px">
      {allOptions.map((option, idx) => {
        return (
          <CheckboxOption
            option={option}
            value={value}
            handleCheckboxChange={(e) => handleCheckboxChange(option.text)}
            checkboxProps={{
              checked: value?.includes(option.text),
            }}
            key={`checkbox-${idx}`}
          />
        );
      })}
      <Box display="flex" gap="10px" alignItems="center">
        <TextField
          multiline={false}
          onChange={handleInputChange}
          value={inputValue}
          placeholder={"Enter your option"}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <ButtonIconWrapper onClick={handleAddClick} height="40px" width="40px">
          <AddIcon
            sx={{
              color: "black",
            }}
          />
        </ButtonIconWrapper>
      </Box>
    </Grid>
  );
};

const LocationType = ({ step, onChange, value }) => {
  return (
    <Grid display="flex" flexDirection="column" gap="14px" width="100%">
      <AutocompleteOptionsComponent
        autocompletProps={{
          getOptionLabel: (option) => option.value,
        }}
        inputProps={{
          sx: {},
        }}
        options={countries}
        value={value}
        onChange={onChange}
        fullWidth
      />
    </Grid>
  );
};

const DataCollectionComponent = ({ step, onChange, value }) => {
  const { dataCollectionType } = step?.additionalData || {};

  if ([DATA_COLLECTION_TYPES.INTERESTS, DATA_COLLECTION_TYPES.SKILLS].includes(dataCollectionType)) {
    return <SelectOption step={step} onChange={onChange} value={value} />;
  }
  if (dataCollectionType === DATA_COLLECTION_TYPES.LOCATION) {
    return <LocationType step={step} onChange={onChange} value={value} />;
  }
  return null;
};

export default DataCollectionComponent;
