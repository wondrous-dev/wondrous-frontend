import { Autocomplete, Popper } from '@mui/material';
import { StyledTextFieldSelect } from 'components/Shared/styles';

const AutocompleteComponent = ({
  id = 'autocomplete-id',
  options,
  handleChange,
  value,
}) => {
  return (
    <Autocomplete
      disablePortal
      id={id}
      options={options}
      value={value}
      sx={{ width: 300 }}
      onChange={(e, { value }) => {
        handleChange(value);
      }}
      PopperComponent={(props) => (
        <Popper
          {...props}
          sx={{
            '.MuiPaper-root': {
              backgroundColor: '#E8E8E8',
              borderRadius: '6px',
            },
          }}
        />
      )}
      renderInput={(params) => (
        <StyledTextFieldSelect
          {...params}
          SelectProps={{
            displayEmpty: true,
            renderValue: (selected) => {
              const selectedOption = options?.find(
                (option) => option.value === selected
              );
              return selectedOption ? selectedOption.label : 'Select';
            },
          }}
        />
      )}
    />
  );
};

export default AutocompleteComponent;
