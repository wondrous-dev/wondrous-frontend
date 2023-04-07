import {
  MenuItem,
} from '@mui/material';

import {
  StyledTextFieldSelect,
} from './styles';
const SelectComponent = ({
  onChange,
  placeholder = 'Select',
  value,
  options,
}) => {
  const handleChange = (e) => onChange(e.target.value);

  return (
    <StyledTextFieldSelect
      select
      defaultValue=''
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      SelectProps={{
        displayEmpty: true,
        renderValue: (selected) => {
          const selectedOption = options?.find(
            (option) => option.value === selected
          );
          return selectedOption ? selectedOption.label : 'Select';
        },
        MenuProps: {
          sx: {
            '.MuiPaper-root': {
              backgroundColor: '#E8E8E8',
              borderRadius: '6px',
            },
          },
        },
      }}
    >
      {options?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </StyledTextFieldSelect>
  );
};

export default SelectComponent;
