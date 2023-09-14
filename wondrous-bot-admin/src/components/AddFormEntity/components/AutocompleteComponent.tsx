import { Autocomplete, Grid, MenuItem, TextField } from "@mui/material";
import ArrowDropDownIcon from "components/Icons/ArrowDropDown";
import CheckCircleIcon from "components/Icons/CheckCircle";
import SearchIcon from "components/Icons/Search";
import { useState } from "react";

const AutocompleteOptionsComponent = ({ options, onChange, value, fullWidth = false, autocompletProps = {}, inputProps = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenClose = (status) => () => setIsOpen(() => status);
  const handleChange = (e, option) => onChange(option.value);
  const selectedValue = options.find((option) => option.value === value);
  return (
    <Autocomplete
      value={selectedValue}
      disableClearable
      popupIcon={isOpen ? <SearchIcon /> : <ArrowDropDownIcon />}
      onOpen={handleOpenClose(true)}
      onClose={handleOpenClose(false)}
      onChange={handleChange}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label=""
          placeholder="Search"
          sx={{
            padding: 0,
            outline: "none",
            "& input": {
              fontFamily: "Poppins, sans-serif",
              fontWeight: "500",
            },
          }}
          {...inputProps}
        />
      )}
      renderOption={(props, option) => {
        return (
          <MenuItem
            {...props}
            sx={{
              height: "40px",
              marginY: "1px",
              borderRadius: "6px",
              padding: "6px",
              fontWeight: "500",
              fontFamily: "Poppins, sans-serif",
              ...(value === option.value && {
                backgroundColor: "#E4E4E4 !important",
              }),
            }}
          >
            <Grid container justifyContent="space-between" alignItems="center" padding="0">
              {option.label || option.value}
              {option.value === value && <CheckCircleIcon />}
            </Grid>
          </MenuItem>
        );
      }}
      ListboxProps={{
        sx: {
          padding: "6px",
          maxHeight: "300px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            WebkitAppearance: "none",
            background: " #fff",
            width: "18px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0, 0, 0, 0.20);",
            border: "6px solid transparent",
            backgroundClip: "padding-box",
            borderRadius: "20px",
          },
          "&::-webkit-scrollbar-thumb": {
            border: "6px solid transparent",
            background: "#2A8D5C",
            backgroundClip: "padding-box",
            borderRadius: "100px",
          },
          "& .MuiAutocomplete-option": {
            padding: "6px",
          },
          "& .Mui-focused": {
            outline: "1px solid #000",
            backgroundColor: "#E4E4E4 !important",
          },
        },
      }}
      slotProps={{
        paper: {
          sx: {
            border: "1px solid #000",
            marginY: "8px",
            borderRadius: "6px",
            "& .MuiAutocomplete-noOptions": {
              fontWeight: "500",
              fontFamily: "Poppins, sans-serif",
            },
          },
        },
      }}
      sx={{
        background: "#C1B6F6",
        borderRadius: "6px",
        padding: "0",
        height: "40px",
        width: fullWidth ? '100%' : '380px',
        "& .MuiInputBase-root.MuiOutlinedInput-root": {
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #000",
          },
          "&:focus-within .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #000",
          },
        },
        "& .MuiAutocomplete-inputRoot": {
          outline: "none",
          borderRadius: "6px",
          height: "40px",
          padding: "6px",
          boxSizing: "border-box",
          "&:focus-visible": {
            outline: "none",
          },
        },
        "& .MuiAutocomplete-input": {
          boxSizing: "border-box",
        },
        "& .MuiAutocomplete-popupIndicatorOpen": {
          transform: "none",
        },
      }}
      {...autocompletProps}
    />
  );
};

export default AutocompleteOptionsComponent;
