import { Autocomplete, Box, Grid, MenuItem, TextField } from "@mui/material";
import ArrowDropDownIcon from "components/Icons/ArrowDropDown";
import CheckCircleIcon from "components/Icons/CheckCircle";
import SearchIcon from "components/Icons/Search";
import ReferralWarningDialog from "components/Referral/referralWarningDialog";
import { ListboxComponent } from "components/Shared/FetchMoreListbox";
import { useState } from "react";
import { scrollbarStyles } from "components/Shared/styles";
import { TYPES } from "utils/constants";
import { CustomComponentWrapper, MenuItemOptionWrapper } from "./styles";

const AutocompleteOptionsComponent = ({
  options,
  onChange,
  value,
  setSteps = null,
  order = null,
  fullWidth = false,
  autocompletProps = {},
  inputProps = {},
  placeholder = "Search",
  bgColor = "#C1B6F6",
  listBoxProps = {},
  disableClearable = true,
  onClear = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenClose = (status) => () => setIsOpen(() => status);
  const selectedValue = options?.find((option) => option.value === value) || null;
  const [openReferralDialog, setOpenReferralDialog] = useState(false);
  const setReferralStep = () => {
    setSteps([
      {
        type: TYPES.REFERRAL,
        order: 1,
        required: true,
        value: "",
      },
    ]);
  };
  return (
    <>
      <ReferralWarningDialog
        open={openReferralDialog}
        onClose={() => setOpenReferralDialog(false)}
        continueClose={setReferralStep}
      />
      <Autocomplete
        value={selectedValue}
        disableClearable={disableClearable}
        popupIcon={isOpen ? <SearchIcon /> : <ArrowDropDownIcon />}
        onOpen={handleOpenClose(true)}
        onClose={handleOpenClose(false)}
        onChange={(e, option) => {
          if (option?.value === TYPES.REFERRAL && order > 1) {
            setOpenReferralDialog(true);
          } else {
            if (option) {
              onChange(option?.value);
            } else {
              onChange(null);
              if (onClear) {
                onClear();
              }
            }
            onChange(option?.value, option);
          }
        }}
        options={options}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              label=""
              placeholder={placeholder}
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
          );
        }}
        renderOption={(props, option) => {
          return (
            <MenuItem
              disabled={option.disabled}
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
              <MenuItemOptionWrapper container justifyContent="space-between" alignItems="center" padding="0">
                {option.label || option.value}
                {option.value === value && !option.customComponent && <CheckCircleIcon />}
                {option.displayCustomOnHover && option.customComponent ? (
                  <CustomComponentWrapper>{option.customComponent()}</CustomComponentWrapper>
                ) : null}
              </MenuItemOptionWrapper>
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
            ...scrollbarStyles,
          },
          ...listBoxProps,
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
          background: bgColor,
          borderRadius: "6px",
          padding: "0",
          height: "40px",
          width: fullWidth ? "100%" : "380px",
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
    </>
  );
};

export default AutocompleteOptionsComponent;
