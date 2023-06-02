import { Box, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ButtonIconWrapper } from "components/Shared/styles";
import AddIcon from "@mui/icons-material/Add";
import { IndexContainer, Label } from "../styles";
import { createFilterOptions } from "@mui/material/Autocomplete";

import AutocompleteComponent from "components/Autocomplete";

const filter = createFilterOptions();

interface IProps {
  handleOnChange: (value: any) => void;
  error?: {
    options: any;
  };
  autoCompleteOptions:
    | Array<{
        label: string;
        value: string;
      }>
    | [];
  label?: string;
  options: Array<string>;
}

const OptionsSelect = ({ handleOnChange, options, error, autoCompleteOptions = [], label = "" }: IProps) => {
  const handleOptionsUpdate = (options) => handleOnChange(options);

  const removeOption = (idx) => {
    const newOptions = [...options];
    newOptions.splice(idx, 1);
    handleOptionsUpdate(newOptions);
  };

  const addOption = () => handleOptionsUpdate([...options, ""]);

  return (
    <>
      <Grid
        item
        gap="14px"
        display="flex"
        flexDirection="column"
        xs={12}
        style={{
          width: "100%",
        }}
      >
        <Label>{label}</Label>
        <Grid display="flex" gap="6px" alignItems="center" flexWrap="wrap">
          <Grid display="flex" gap="8px" flexDirection="column" width="100%">
            {options?.map((option, idx) => (
              <Grid display="flex" flexDirection="column" gap="10px" key={`${option}_${idx}`}>
                <Grid display="flex" alignItems="center" gap="14px" width="100%">
                  <IndexContainer>{idx + 1}.</IndexContainer>
                  <AutocompleteComponent
                    options={autoCompleteOptions}
                    sx={{
                      width: "100%",
                    }}
                    openOnInput
                    disclaimer={option === "other" ? "User will be able to enter their own options" : ""}
                    handleChange={(value) => {
                      const newOptions = [...options];
                      newOptions[idx] = value;
                      handleOptionsUpdate(newOptions);
                    }}
                    error={error?.options?.[idx]?.text}
                    autocompleteProps={{
                      selectOnFocus: true,
                      clearOnBlur: true,
                      handleHomeEndKeys: true,
                      freeSolo: true,
                      filterOptions: (options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some((option) => inputValue === option.label);
                        if (inputValue !== "" && !isExisting) {
                          filtered.push({
                            value: inputValue,
                            label: `Add "${inputValue}"`,
                          });
                        }

                        return filtered;
                      },
                    }}
                    value={option}
                  />
                  <Box display="flex" gap="10px">
                    {options.length > 1 ? (
                      <ButtonIconWrapper onClick={() => removeOption(idx)}>
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                        />
                      </ButtonIconWrapper>
                    ) : null}
                  </Box>
                </Grid>
              </Grid>
            ))}
            {options?.length < 25 ? (
              <Box display="flex" gap="10px" alignItems="center">
                <ButtonIconWrapper onClick={addOption}>
                  <AddIcon
                    sx={{
                      color: "black",
                    }}
                  />
                </ButtonIconWrapper>
                <Label>Add option</Label>
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default OptionsSelect;
