import { Grid, Box, Typography } from "@mui/material";
import { StyledCheckbox } from "components/PaymentLedger/styles";
import TextField from "components/Shared/TextField";
import { ButtonIconWrapper, ErrorText } from "components/Shared/styles";
import { useMemo, useState } from "react";
import { DATA_COLLECTION_TYPES, TYPES } from "utils/constants";

import AddIcon from "@mui/icons-material/Add";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import countries from "utils/countries";

const SelectOption = ({ step, onChange, value = []}) => {
  const [inputValue, setInputValue] = useState("");
    console.log(value, 'VALUE1')
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

  return (
    <Grid display="flex" flexDirection="column" gap="14px">
      {allOptions.map((option, idx) => {
        return (
          <Box
            padding="8px 12px"
            borderRadius="6px"
            bgcolor="#E8E8E8"
            border="1px solid black"
            display="flex"
            alignItems="center"
            gap="12px"
          >
            <StyledCheckbox
              bgcolor={"#2A8D5C"}
              height="22px"
              width="22px"
              checked={value?.includes(option.text)}
              onChange={(e) => handleCheckboxChange(option.text)}
            />
            <Typography fontFamily="Poppins" fontSize="16px" fontWeight={500} lineHeight="24px" color="#1D1D1D">
              {option.text}
            </Typography>
          </Box>
        );
      })}
      <Box display="flex" gap="10px" alignItems="center">
        <TextField
          multiline={false}
          onChange={handleInputChange}
          value={inputValue}
          placeholder={"Enter your option"}
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
