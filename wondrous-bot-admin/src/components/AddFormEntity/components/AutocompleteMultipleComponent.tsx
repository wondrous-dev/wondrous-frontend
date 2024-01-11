import { Autocomplete, Box, Grid, MenuItem, TextField } from "@mui/material";
import ArrowDropDownIcon from "components/Icons/ArrowDropDown";
import CheckCircleIcon from "components/Icons/CheckCircle";
import SearchIcon from "components/Icons/Search";
import ReferralWarningDialog from "components/Referral/referralWarningDialog";
import { ListboxComponent } from "components/Shared/FetchMoreListbox";
import { useState } from "react";
import { scrollbarStyles } from "components/Shared/styles";
import { TYPES } from "utils/constants";
import ErrorField from "components/Shared/ErrorField";
import { CustomComponentWrapper, MenuItemOptionWrapper, StyledChipTag } from "./styles";

const AutocompleteMultipleComponent = ({
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
  error = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenClose = (status) => () => setIsOpen(() => status);
  const selectedValue = value;
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
        multiple
        value={value}
        disableClearable={disableClearable}
        popupIcon={isOpen ? <SearchIcon /> : <ArrowDropDownIcon />}
        onOpen={handleOpenClose(true)}
        onClose={handleOpenClose(false)}
        onChange={(e, option) => {
          const newArr = option.map((item) => item?.value);
          onChange(newArr);
        }}
        options={options}
        renderInput={(params) => {
          return (
            <>
              <TextField
                {...params}
                label=""
                placeholder={placeholder}
                sx={{
                  outline: "none",
                  "& input": {
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: "500",
                    paddingLeft: "8px",
                  },
                }}
                {...inputProps}
              />
            </>
          );
        }}
        renderTags={(value, getLabelProps) =>
          value?.map((option, index) => {
            const props = getLabelProps({ index });
            return (
              <StyledChipTag
                key={index}
                deleteIcon={
                  <div
                    style={{
                      marginTop: "-4px",
                    }}
                  >
                    &times;
                  </div>
                }
                onClick={props.onDelete}
                label={option?.label}
                // background={option.color}
                variant="outlined"
                onDelete={props.onDelete}
              />
            );
          })
        }
        renderOption={(props, option) => {
          return (
            <MenuItem
              disabled={option.disabled}
              {...props}
              {...(option.onClick ? { onClick: option.onClick } : {})}
              sx={{
                height: "50px",
                borderRadius: "6px",
                padding: "0px",
                fontWeight: "500",
                fontFamily: "Poppins, sans-serif",
                ...((value === option.value || option.isSelected) && {
                  backgroundColor: "#E4E4E4 !important",
                }),
              }}
            >
              <MenuItemOptionWrapper container justifyContent="space-between" alignItems="center" padding="0">
                <Grid container item flex="1" gap="4px">
                  {option.icon}
                  {option.label || option.value}
                </Grid>

                {(option.value === value || option.isSelected) && !option.customComponent && <CheckCircleIcon />}
                {option.displayCustomOnHover && option.customComponent ? (
                  <CustomComponentWrapper>{option.customComponent()}</CustomComponentWrapper>
                ) : null}
              </MenuItemOptionWrapper>
            </MenuItem>
          );
        }}
        ListboxProps={{
          sx: {
            padding: "0px",
            paddingLeft: "6px",
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
              padding: "0px",
              paddingLeft: "8px",
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
          minHeight: "50px",
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
            minHeight: "50px",
            padding: "0px",
            paddingLeft: "6px",
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

export default AutocompleteMultipleComponent;
