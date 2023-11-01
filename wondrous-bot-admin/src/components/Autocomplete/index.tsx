import { Autocomplete, Popper, Typography } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import ErrorField from "components/Shared/ErrorField";
import { ErrorText, StyledTextFieldSelect } from "components/Shared/styles";
import { useState } from "react";

const AutocompleteComponent = ({
  id = "autocomplete-id",
  options,
  handleChange = null,
  value,
  renderInputProps = {},
  sx = {},
  autocompleteProps = {},
  openOnInput = false,
  error = null,
  disclaimer = null,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    if (newInputValue.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <Autocomplete
      disablePortal
      inputValue={inputValue}
      onInputChange={handleInputChange}
      id={id}
      options={options}
      value={value}
      getOptionLabel={(option) => {
        return option?.label || options?.find((i) => i.value === option)?.label || option;
      }}
      sx={{ width: 300, ...sx }}
      onChange={(e, { value }) => {
        handleChange?.(value);
      }}
      PopperComponent={(props) => (
        <Popper
          {...props}
          {...(openOnInput ? { open: isOpen } : {})}
          sx={{
            ".MuiPaper-root": {
              backgroundColor: "#E8E8E8",
              borderRadius: "6px",
            },
          }}
        />
      )}
      renderInput={(params) => (
        <>
          <StyledTextFieldSelect
            {...renderInputProps}
            {...params}
            SelectProps={{
              displayEmpty: true,
            }}
          />
          {disclaimer ? (
            <Typography
              color="#4d4d4d"
              fontFamily="Poppins"
              fontWeight={500}
              fontSize="10px"
              lineHeight="24px"
              fontStyle="italic"
              whiteSpace="nowrap"
            >
              {disclaimer}
            </Typography>
          ) : null}
          {error ? <ErrorField errorText={error} /> : null}
        </>
      )}
      {...autocompleteProps}
    />
  );
};

export default AutocompleteComponent;
