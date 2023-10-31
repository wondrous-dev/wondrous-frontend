import { Box, Grid, ListSubheader, MenuItem } from "@mui/material";

import CheckCircleIcon from "components/Icons/CheckCircle";
import { scrollbarStyles } from "components/Shared/styles";
import { ErrorText, StyledTextFieldSelect } from "./styles";
import ErrorField from "./ErrorField";

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
  defaultLabel = "Select",
  onOpen = null,
  grouped = false,
  groupedOptions = [],
  minWidth = "100px"
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
        minWidth={minWidth}
        placeholder={placeholder}
        background={background}
        onChange={handleChange}
        SelectProps={{
          displayEmpty: true,
          onOpen: () => onOpen?.(),
          renderValue: (selected) => {
            const selectedOption = options?.find((option) => option.value === selected);
            return selectedOption ? selectedOption.label : defaultLabel;
          },
          MenuProps: {
            sx: { marginTop: "8px" },
            PaperProps: {
              sx: {
                outline: `1px solid ${error ? '#CE414D' : '#000'}`,
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
        {grouped
          ? groupedOptions.map((group, idx) => [
              group.groupName ? <ListSubheader sx={{ position: "relative" }}>{group.groupName}</ListSubheader> : null,
              group?.items?.map((option, optionIdx) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
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
                  {...(option.onClick ? { onClick: option.onClick } : {})}
                >
                  <Grid container alignItems="center" justifyContent="space-between" gap="4px">
                    <Grid container item flex="1" gap="4px">
                      {option.icon}
                      {option.label}
                    </Grid>
                    <Grid container item width="fit-content" alignItems="center" gap="8px">
                    {option?.customComponent?.()}
                    {option.value === value && <CheckCircleIcon />}
                  </Grid>
                  </Grid>
                </MenuItem>
              )),
            ])
          : options?.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
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
                {...(option.onClick ? { onClick: option.onClick } : {})}
              >
                <Grid container alignItems="center" justifyContent="space-between" gap="4px">
                  <Grid container item flex="1" gap="4px">
                    {option.icon}
                    {option.label}
                  </Grid>
                  <Grid container item width="fit-content" alignItems="center" gap="8px">
                    {option?.customComponent?.()}
                    {option.value === value && <CheckCircleIcon />}
                  </Grid>
                </Grid>
              </MenuItem>
            ))}
      </StyledTextFieldSelect>
      <ErrorField errorText={error}/>
    </Box>
  );
};

export default SelectComponent;
