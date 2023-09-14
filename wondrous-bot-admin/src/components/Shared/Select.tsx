import { Box, MenuItem } from "@mui/material";

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
  defaultLabel = 'Select',
  onOpen = null
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
            return selectedOption ? selectedOption.label : defaultLabel;
          },
          MenuProps: {
            MenuListProps: {
              'data-tour': 'tutorial-quest-select-menu',
            },
            sx: {
              ".MuiPaper-root": {
                backgroundColor: "#E8E8E8",
                borderRadius: "6px",
              },
            },
          },
        }}
      >
        {options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </StyledTextFieldSelect>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Box>
  );
};

export default SelectComponent;
