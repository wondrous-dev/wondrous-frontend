import { Box, Grid, MenuItem } from "@mui/material";

import CheckCircleIcon from "components/Icons/CheckCircle";
import { scrollbarStyles } from "components/Shared/styles";
import { ErrorText, StyledTextFieldSelect } from "./styles";

const SelectComponent = ({
  onChange,
  placeholder = "Select",
  value,
  options = [],
  background = null,
  style = {},
  boxStyle = {},
  error = null,
  disabled = false,
  onOpen = null,
}) => {
  const handleChange = (e) => onChange(e.target.value);

  return (
    <Box style={boxStyle} data-tour="tutorial-quest-select">
      <StyledTextFieldSelect
        select
        defaultValue=""
        disabled={disabled}
        value={value}
        style={style}
        placeholder={placeholder}
        background={background}
        onChange={handleChange}
        SelectProps={{
          displayEmpty: true,
          onOpen: () => onOpen?.(),
          renderValue: (selected) => {
            const selectedOption = options?.find((option) => option.value === selected);
            return selectedOption ? selectedOption.label : "Select";
          },
          MenuProps: {
            disablePortal: true,
            sx: { marginTop: "8px" },
            PaperProps: {
              sx: {
                outline: "1px solid #000",
              },
            },
            MenuListProps: {
              "data-tour": "tutorial-quest-select-menu",
              sx: {
                overflow: "hidden",
                borderRadius: "6px",
                padding: "6px",
                "& .Mui-focused": {
                  outline: "1px solid #000",
                  backgroundColor: "#E4E4E4 !important",
                },
                maxHeight: "300px",
                ...scrollbarStyles,
              },
            },
          },
        }}
      >
        {options?.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            selected={value === option.value}
            sx={{
              marginY: "1px",
              padding: "8px",
              height: "40px",
              borderRadius: "6px",
              "&.Mui-selected": {
                backgroundColor: "#E4E4E4 !important",
                outline: "1px solid #000",
              },
              "&:hover": {
                backgroundColor: "#E4E4E4 !important",
              },
            }}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid container item flex="1">
                {option.icon}
                {option.label}
              </Grid>
              <Grid container item width="fit-content">
                {option.value === value && <CheckCircleIcon />}
              </Grid>
            </Grid>
          </MenuItem>
        ))}
      </StyledTextFieldSelect>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Box>
  );
};

export default SelectComponent;
